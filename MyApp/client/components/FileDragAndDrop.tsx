import React, { ChangeEvent, useCallback, useRef, useState, useEffect } from 'react';
import bs from './scss/init.scss';

const FileDragAndDrop = ({ onChange }: { onChange: (event: ChangeEvent<HTMLInputElement>) => void }) => {
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [files, setFiles] = useState<Blob | null>(null);

	const inputRef = useRef<HTMLInputElement>(null);
	const dragRef = useRef<HTMLLabelElement>(null);

	const handleDragIn = useCallback((e: DragEvent): void => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDragOut = useCallback((e: DragEvent): void => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDragOver = useCallback((e: DragEvent): void => {
		e.preventDefault();
		e.stopPropagation();

		if (e.dataTransfer!.files) {
			setIsDragging(true);
		}
	}, []);

	const handleDrop = useCallback((e: DragEvent | any): void => {
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
			onChange(e);
		}

		setFiles(selectFiles);
		setIsDragging(false);
	}, []);

	const initDragEvents = useCallback((): void => {
		if (dragRef.current !== null) {
			dragRef.current.addEventListener('dragenter', handleDragIn);
			dragRef.current.addEventListener('dragleave', handleDragOut);
			dragRef.current.addEventListener('dragover', handleDragOver);
			dragRef.current.addEventListener('drop', handleDrop);
		}
	}, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

	const resetDragEvents = useCallback((): void => {
		if (dragRef.current !== null) {
			dragRef.current.removeEventListener('dragenter', handleDragIn);
			dragRef.current.removeEventListener('dragleave', handleDragOut);
			dragRef.current.removeEventListener('dragover', handleDragOver);
			dragRef.current.removeEventListener('drop', handleDrop);
		}
	}, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

	useEffect(() => {
		initDragEvents();

		return () => resetDragEvents();
	}, [initDragEvents, resetDragEvents]);

	return (
		<div className={bs['dragAndDrop']}>
			<input type="file" id="fileUpload" style={{ display: 'none' }} multiple={false} onChange={onChange} accept="image/*" ref={inputRef} />
			<label className={isDragging ? bs['dragging'] : ''} htmlFor="fileUpload" ref={dragRef}>
				<div>⇪</div>
			</label>
		</div>
	);
};

export default FileDragAndDrop;
