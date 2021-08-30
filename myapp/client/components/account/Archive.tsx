import styles from '../../scss/app.scss';
import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import axios from 'axios';
import { getCookie } from '../../helper/init';
import { UserContext } from '../../context/UserContext';
import ArchiveContent from './ArchiveContent';
import cn from 'classnames';

const Archive = () => {
	const [thumbnailNo, setThumbnailNo] = useState<number[]>([]);
	const [selectedElement, setSelectedElement] = useState<any[]>([]);
	const [isDeleting, setIsDeleting] = useState(false);
	const {
		state: { value: userContextValue },
	} = useContext(UserContext)!;
	const { accessToken } = userContextValue!;
	const thumbnailDivWrapperRef = useRef<HTMLDivElement>(null);

	const handleSelectContent = useCallback((event: React.MouseEvent) => {
		if (event !== null && event.currentTarget instanceof HTMLElement) {
			const element = event.currentTarget.previousSibling;

			setSelectedElement(p => {
				if (p.includes(element)) {
					const copiedArr = [...p];
					copiedArr.splice(copiedArr.indexOf(element), 1);
					return copiedArr;
				} else {
					return [...p, element];
				}
			});
		}
	}, []);

	const onClickSelectAll = useCallback(event => {
		event.stopPropagation();

		if (thumbnailDivWrapperRef.current && event.currentTarget) {
			const inputElementList = thumbnailDivWrapperRef.current.querySelectorAll('input');
			if (event.currentTarget.checked) {
				inputElementList.forEach(x => {
					if (!x.checked) x.click();
				});
			} else {
				inputElementList.forEach(x => {
					if (x.checked) x.click();
				});
			}
		}
	}, []);

	const onClickDownload = useCallback(() => {
		if (selectedElement.length == 0) return;
		if (selectedElement.length == 1) {
			const link = document.createElement('a');
			link.style.display = 'none';
			link.download = selectedElement[0].dataset.filename;
			link.href = selectedElement[0].src as string;
			link.click();
		} else {
			import('jszip').then(({ default: JSZip }) => {
				const zip = new JSZip();

				for (const el of selectedElement) {
					let filename = el.dataset.filename;
					let n = 1;

					while (true) {
						if (!zip.files[filename]) break;
						filename = filename.replace(/( \(\d+\))?(\..*)$/, ` (${n++})$2`);
					}

					const i = el.src.indexOf('base64,') + 'base64,'.length;
					zip.file(filename, el.src.substring(i), { base64: true });
				}

				zip.generateAsync({ type: 'blob' }).then(blob => {
					const objURL = window.URL.createObjectURL(blob);
					const date = new Date();
					const formatted_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

					const link = document.createElement('a');
					link.download = 'archive.' + formatted_date + '.zip';
					link.href = objURL;
					link.click();
				});
			});
		}
	}, [selectedElement]);

	const onClickDelete = useCallback(() => {
		if (selectedElement.length == 0) return;
		setIsDeleting(true);

		axios({
			url: '/user/archive',
			method: 'DELETE',
			data: {
				noList: selectedElement.map(x => parseInt(x.dataset.no)),
			},
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
			},
		})
			.then(res => {
				const { success, message, value } = res.data;

				if (success) {
					const deletedNoList = value.deleted_paths.map((x: any) => x.no);
					const copiedArr = [...thumbnailNo];

					for (const deletedNo of deletedNoList) {
						if (copiedArr.includes(deletedNo)) {
							copiedArr.splice(copiedArr.indexOf(deletedNo), 1);
						}
					}

					setThumbnailNo(copiedArr);
				} else {
					alert(`Delete error : ${message}`);
				}
			})
			.catch(err => {
				alert(err);
			})
			.finally(() => {
				setIsDeleting(false);
			});
	}, [thumbnailNo, selectedElement]);

	useEffect(() => {
		axios({
			url: '/user/archive',
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'X-CSRF-TOKEN': getCookie('csrf_refresh_token'),
			},
		})
			.then(res => {
				const { success, message, value } = res.data;

				if (success) {
					setThumbnailNo(value.no_list);
				} else {
					alert(`Loading error : ${message}`);
				}
			})
			.catch(err => {
				alert(err);
			});
	}, []);

	return (
		<div className={styles['c-account-archive']}>
			<div className={styles['c-account-archive-contents']} ref={thumbnailDivWrapperRef}>
				{thumbnailNo.map(no => (
					<ArchiveContent handleSelectContent={handleSelectContent} no={no} key={no} />
				))}
			</div>
			<div className={styles['c-account-archive-controllbox']}>
				<div>
					<input id="select-all" type="checkbox" onChange={onClickSelectAll} />
					<label htmlFor="select-all">전체 선택</label>
				</div>

				<div>
					<button onClick={onClickDownload} className={styles['gc-button-green']}>
						다운로드
					</button>
					<button onClick={onClickDelete} className={styles['gc-button-red']} disabled={isDeleting}>
						{isDeleting ? (
							<>
								&nbsp;&nbsp;&nbsp;&nbsp;
								<div className={styles['gc-loading-wheel-btn']} />
							</>
						) : (
							'삭제'
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Archive;
