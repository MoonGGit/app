import React, { ChangeEvent, useCallback, useRef, useState, useEffect } from 'react';
import styles from '../../../scss/app.scss';

const FileDragAndDrop = ({ handleChangeFile }: { handleChangeFile: (event: ChangeEvent<HTMLInputElement>) => void }) => {
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [files, setFiles] = useState<Blob | null>(null);

	const inputRef = useRef<HTMLInputElement>(null);
	const dragRef = useRef<HTMLLabelElement>(null);

	const onDragEnter = useCallback((e: DragEvent): void => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const onDragLeave = useCallback((e: DragEvent): void => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const onDragOver = useCallback((e: DragEvent): void => {
		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer!.files) {
			setIsDragging(true);
		}
	}, []);

	const onDrop = useCallback((e: DragEvent | any): void => {
		e.preventDefault();
		e.stopPropagation();

		let selectFiles: Blob | null = null;

		if (inputRef.current !== null) {
			if (e.type === 'drop') {
				selectFiles = e.dataTransfer.files;
				inputRef.current.files = e.dataTransfer.files;
			} else {
				selectFiles = e.target.files;
				inputRef.current.files = e.target.files;
			}

			// 드래그&드랍은 실행시켜줘야 함
			handleChangeFile(e);
		}

		setFiles(selectFiles);
		setIsDragging(false);
	}, []);

	const initDragEvents = useCallback((): void => {
		if (dragRef.current !== null) {
			dragRef.current.addEventListener('dragenter', onDragEnter);
			dragRef.current.addEventListener('dragleave', onDragLeave);
			dragRef.current.addEventListener('dragover', onDragOver);
			dragRef.current.addEventListener('drop', onDrop);
		}
	}, [onDragEnter, onDragLeave, onDragOver, onDrop]);

	const resetDragEvents = useCallback((): void => {
		if (dragRef.current !== null) {
			dragRef.current.removeEventListener('dragenter', onDragEnter);
			dragRef.current.removeEventListener('dragleave', onDragLeave);
			dragRef.current.removeEventListener('dragover', onDragOver);
			dragRef.current.removeEventListener('drop', onDrop);
		}
	}, [onDragEnter, onDragLeave, onDragOver, onDrop]);

	useEffect(() => {
		initDragEvents();

		return () => resetDragEvents();
	}, [initDragEvents, resetDragEvents]);

	return (
		<div className={styles['c-page-dots-fileDragAndDrop']}>
			<input type="file" id="fileUpload" multiple={false} onChange={handleChangeFile} accept="image/*" ref={inputRef} />
			<label className={isDragging ? styles['c-page-dots-fileDragAndDrop-dragging'] : ''} htmlFor="fileUpload" ref={dragRef}>
				<div>⇪</div>
			</label>
		</div>
	);
};

export default FileDragAndDrop;
