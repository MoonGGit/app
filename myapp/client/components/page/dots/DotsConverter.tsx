import { useRef, useState, useEffect, ChangeEvent, useCallback, useContext } from 'react';
import FileDragAndDrop from './FileDragAndDrop';
import { AiOutlineDownload } from 'react-icons/ai';
import { RiKakaoTalkFill } from 'react-icons/ri';
import useScript from '../../../hooks/useScript';
import { globalValue, dataURLtoFile } from '../../../helper/init';
import ModalUpload from '../../util/ModalUpload';
import axios from 'axios';
import styles from '../../../scss/app.scss';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { UserContext } from '../../../context/UserContext';
import { getCookie } from '../../../helper/init';

const DotsConverter = () => {
	const [imageFile, setImageFile] = useState<File | any>(null);
	const [dotsImageDataURL, setDotsImageDataURL] = useState<string | null>(null);
	const [isUpload, setIsUpload] = useState(false);

	const imageRef = useRef<HTMLImageElement>(null);
	const imageSizeRef = useRef<HTMLSelectElement>(null);
	const dotsSizeRef = useRef<HTMLInputElement>(null);
	const dotsAccurancy = useRef<HTMLInputElement>(null);

	const {
		state: { value: userContextValue },
	} = useContext(UserContext)!;

	const onClickUploadToggle = useCallback(() => {
		if (dotsImageDataURL) {
			setIsUpload(!isUpload);
		} else {
			alert('이미지를 변환해 주세요.');
		}
	}, [isUpload, dotsImageDataURL]);

	const handleUpload = useCallback(() => {
		return axios({
			url: '/dots-converter/archive',
			method: 'POST',
			data: {
				dotsImageDataURL: dotsImageDataURL,
				fileName: imageFile!.name,
			},
			headers: {
				Authorization: `Bearer ${userContextValue?.accessToken}`,
				'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
			},
		});
	}, [dotsImageDataURL, userContextValue]);

	useScript('https://developers.kakao.com/sdk/js/kakao.min.js', true, () => {
		globalValue.Kakao = window.Kakao;
		globalValue.Kakao.init('5d70b9d2ccbc01b4a91e1dd980df65fb');
	});

	const onClickKakaoShare = useCallback(() => {
		if (globalValue.Kakao.isInitialized() && dotsImageDataURL) {
			globalValue.Kakao.Link.uploadImage({
				file: [dataURLtoFile(dotsImageDataURL, 'dots.' + imageFile!.name)],
			})
				.then((res: any) => {
					globalValue.Kakao.Link.sendDefault({
						objectType: 'feed',
						content: {
							title: '',
							imageUrl: res.infos.original.url,
							description: res.infos.original.url,
							link: {
								mobileWebUrl: '',
								webUrl: '',
							},
						},
					});
				})
				.catch((err: any) => console.log(err));
		} else {
			alert('이미지를 변환해 주세요.');
		}
	}, [dotsImageDataURL]);

	const handleChangeFile = useCallback((event: ChangeEvent<HTMLInputElement> | any): void => {
		let imageFile = null;

		if (event.type === 'drop') {
			imageFile = event.dataTransfer.files[0];
		} else {
			imageFile = event.target.files[0];
		}

		if (imageFile) {
			const validType = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];
			if (!validType.includes(imageFile.type)) {
				alert('올바른 이미지를 선택해주세요.');
				return;
			}

			setImageFile(imageFile);
			setDotsImageDataURL(null);

			const reader = new FileReader();

			reader.onload = event => {
				if (imageRef.current !== null) {
					imageRef.current.src = event.target!.result as string;
					imageRef.current.style.visibility = 'visible';
				}
			};
			reader.readAsDataURL(imageFile);
		}
	}, []);

	// 변환 작업
	const onClickConvert = useCallback(async () => {
		if (imageFile && imageSizeRef.current && dotsSizeRef.current && dotsAccurancy.current && imageRef.current) {
			const imageSize = imageSizeRef.current.value;
			const dotsSize = parseInt(dotsSizeRef.current.value);
			const accurancy = parseInt(dotsAccurancy.current.value);

			try {
				// 원본 File에서 base64ImageData로 변환, img.src 주입용
				const reader = new FileReader();
				let base64ImageData = null;

				reader.onload = event => {
					base64ImageData = event.target!.result;
					const [x, y] = imageSize.split('X'); // 해상도
					const imageWith = parseInt(x);
					const imageHeight = parseInt(y);

					const dotsSizeX = dotsSize;
					const dotsSizeXRest = imageWith % dotsSizeX;
					const dotsSizeY = dotsSize;
					const dotsSizeYRest = imageHeight % dotsSizeY;

					const img = new Image();
					const canvas = document.createElement('canvas');
					canvas.width = imageWith;
					canvas.height = imageHeight;
					const ctx = canvas.getContext('2d')!;

					img.onload = () => {
						// img의 0, 0 좌표에서 img.width, img.height 크기만큼 잘라서, 0,0좌표부터 canvas.width, canvas.height 크기로 그림
						ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

						// 이미지를 도트 크기로 나누어서 각각 처리
						for (let x = 0; x < canvas.width; x += dotsSizeX) {
							for (let y = 0; y < canvas.height; y += dotsSizeY) {
								const width = x + dotsSizeX <= canvas.width ? dotsSizeX : dotsSizeXRest;
								const height = y + dotsSizeY <= canvas.height ? dotsSizeY : dotsSizeYRest;
								const r = [],
									g = [],
									b = [],
									a = [];

								// accurancy 횟수만큼 랜덤 위치 픽셀 추출
								for (let colorCombination = 0; colorCombination < accurancy; colorCombination++) {
									const randomX = Math.floor(Math.random() * width);
									const randomY = Math.floor(Math.random() * height);

									const imageData = ctx.getImageData(x + randomX, y + randomY, 1, 1);
									const imageUint8ClindedArray = imageData.data;

									r.push(imageUint8ClindedArray[0]);
									g.push(imageUint8ClindedArray[1]);
									b.push(imageUint8ClindedArray[2]);
									a.push(imageUint8ClindedArray[3]);
								}

								// rgb조합
								const averR = Math.floor(r.reduce((a, b) => a + b, 0) / accurancy);
								const averG = Math.floor(g.reduce((a, b) => a + b, 0) / accurancy);
								const averB = Math.floor(b.reduce((a, b) => a + b, 0) / accurancy);
								const averA = Math.floor(a.reduce((a, b) => a + b, 0) / accurancy);

								// rgb색칠
								ctx.fillStyle = `rgba(${averR},${averG}, ${averB}, ${averA})`;
								ctx.fillRect(x, y, width, height);
								console.log(x, y, width, height);
							}
						}
						// base64ImageData
						const convertedImageData = canvas.toDataURL();
						imageRef.current!.src = convertedImageData;
						setDotsImageDataURL(convertedImageData);
					};

					if (base64ImageData !== null) {
						img.src = base64ImageData as string;
					}
				};
				reader.readAsDataURL(imageFile);
			} catch (err) {
				alert('변환에 실패했습니다..' + err);
			}
		} else alert('이미지를 선택해주세요.');
	}, [imageFile]);

	const onClickDownload = useCallback(() => {
		if (dotsImageDataURL) {
			const link = document.createElement('a');
			link.style.display = 'none';
			link.download = 'dots.' + imageFile!.name;
			link.href = dotsImageDataURL as string;
			document.body.append(link);
			link.click();
			link.remove();
		} else {
			alert('이미지를 변환해 주세요.');
		}
	}, [dotsImageDataURL]);

	return (
		<section className={styles['c-page-dots-dotsConverter']}>
			<div className={styles['c-page-dots-dotsConverter-view-wrapper']}>
				<div className={styles['c-page-dots-dotsConverter-view']}>
					<FileDragAndDrop handleChangeFile={handleChangeFile} />
					<img ref={imageRef} />
				</div>

				<div className={styles['c-page-dots-dotsConverter-view-nav']}>
					<button onClick={onClickUploadToggle}>
						<span>
							<AiOutlineCloudUpload />
						</span>
					</button>
					{isUpload ? <ModalUpload callBack={handleUpload} handleCloseModal={onClickUploadToggle} /> : null}

					<button>
						<span onClick={onClickKakaoShare}>
							<RiKakaoTalkFill />
						</span>
					</button>
					<button onClick={onClickDownload}>
						<span>
							<AiOutlineDownload />
						</span>
					</button>
				</div>
			</div>

			<div className={styles['c-page-dots-dotsConverter-table-wrapper']}>
				<table className={styles['c-page-dots-dotsConverter-table']}>
					<thead>
						<tr>
							<th>옵션</th>
							<th>설정</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>사이즈</td>
							<td>
								<select ref={imageSizeRef}>
									<option value="640X480">640×480</option>
									<option value="800X600">800×600</option>
									<option value="1280X720">1280x720</option>
									<option value="1600X1200">1600×1200</option>
									<option value="1920X1200">1920×1200</option>
									{/* todo : 원본 추가 */}
								</select>
							</td>
						</tr>
						<tr>
							<td>도트 크기</td>
							<td>
								<input type="range" min="1" max="100" step="1" defaultValue="5" ref={dotsSizeRef} />
								<br />
								<small>* 렉 주의 *</small>
							</td>
						</tr>
						<tr>
							<td>정확도</td>
							<td>
								<input type="range" min="1" max="9" step="1" defaultValue="1" ref={dotsAccurancy} />
							</td>
						</tr>
					</tbody>
				</table>
				<button onClick={onClickConvert}>CONVERT</button>
			</div>
		</section>
	);
};

export default DotsConverter;
