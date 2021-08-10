import { useRef, useState, useEffect, ChangeEvent, useCallback } from 'react';
import FileDragAndDrop from './FileDragAndDrop';
import bs from './scss/init.scss';
import { AiOutlineDownload } from 'react-icons/ai';
import { RiKakaoTalkFill } from 'react-icons/ri';
import useScript from '../hooks/useScript';
import { globalValue, dataURLtoFile } from '../helper/init';

const DotsConverter = () => {
	const [imageFile, setImageFile] = useState<File | any>(null);
	const [dotsImageData, setDotsImageData] = useState<string | null>(null);

	const imageRef = useRef<HTMLImageElement>(null);
	const imageSizeRef = useRef<HTMLSelectElement>(null);
	const dotsSizeRef = useRef<HTMLInputElement>(null);
	const dotsAccurancy = useRef<HTMLInputElement>(null);

	useScript('https://developers.kakao.com/sdk/js/kakao.min.js', true, () => {
		globalValue.Kakao = window.Kakao;
		globalValue.Kakao.init('5d70b9d2ccbc01b4a91e1dd980df65fb');
	});

	const onClickKakaoShare = useCallback(() => {
		if (globalValue.Kakao.isInitialized() && dotsImageData) {
			globalValue.Kakao.Link.uploadImage({
				file: [dataURLtoFile(dotsImageData, 'dots.' + imageFile!.name)],
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
				.catch((err: any) => alert(err));
		} else {
			alert('이미지를 변환해 주세요.');
		}
	}, [dotsImageData]);

	// FileDragAndDrop컴포넌트의 input값 변경 시, 타입체크 후 이미지 미리보기
	const onChangeFiles = useCallback((event: ChangeEvent<HTMLInputElement> | any): void => {
		// 이미지인지 체크 후에

		let imageFile = null;

		if (event.type === 'drop') {
			imageFile = event.dataTransfer.files[0];
		} else {
			imageFile = event.target.files[0];
		}

		if (imageFile) {
			setImageFile(imageFile);

			// 이미지 미리보기, File --> data:image/xxx;base64로 변환시켜줌 ,, src에 적용가능
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
	// todo : 공백 png는 해당 블럭 에러, 화살표보임
	const handleConvert = useCallback(async () => {
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
					// 변수들 설정
					const [x, y] = imageSize.split('X'); // 해상도
					const imageWith = parseInt(x);
					const imageHeight = parseInt(y);

					// 도트크기 지정
					const dotsSizeX = dotsSize;
					const dotsSizeXRest = imageWith % dotsSizeX;
					const dotsSizeY = dotsSize;
					const dotsSizeYRest = imageHeight % dotsSizeY;

					// 캔버스 작업
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
						setDotsImageData(convertedImageData);
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

	const handleDownload = useCallback(() => {
		if (dotsImageData) {
			const link = document.createElement('a');
			link.style.display = 'none';
			link.download = 'dots.' + imageFile!.name;
			link.href = dotsImageData as string;
			document.body.append(link);
			link.click();
			link.remove();
		} else {
			alert('이미지를 변환해 주세요.');
		}
	}, [dotsImageData]);

	return (
		<section className={bs['dotsConverter-Wrapper']}>
			{/* 이미지 래퍼 */}
			<div className={bs['dotsConverterView-Wrapper']}>
				{/* 변환기 */}
				<div className={bs['dotsConverter-View']}>
					<FileDragAndDrop onChange={onChangeFiles} />
					<img ref={imageRef} className={bs['dragAndDropImage']}></img>
				</div>
				{/* 버튼래퍼 */}
				<div className={bs['dotsConverter-Nav']}>
					<button>
						<span>
							<RiKakaoTalkFill onClick={onClickKakaoShare} />
						</span>
					</button>
					<button onClick={handleDownload}>
						<span>
							<AiOutlineDownload />
						</span>
					</button>
				</div>
			</div>

			{/* 테이블 */}
			<div className={bs['dotsConverter-settingTable-wrapper']}>
				<table className={bs['dotsConverter-settingTable']}>
					{/* 옵션 */}
					<thead>
						<tr>
							<th>옵션</th>
							<th>설정</th>
						</tr>
					</thead>

					{/* 설정창 */}
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
				<button onClick={handleConvert}>CONVERT</button>
			</div>
		</section>
	);
};

export default DotsConverter;
