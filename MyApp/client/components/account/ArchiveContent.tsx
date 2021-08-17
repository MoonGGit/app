import useFetch from '../../hooks/useFetch';

const ArchiveContent = ({ imgData, handleSelectContent }: { imgData: FunctionStringCallback; handleSelectContent: Function }) => {
	const Img = useFetch(`/${imgData}`);

	const onClickSelectContent = (event: React.MouseEvent<HTMLElement>) => {
		handleSelectContent(event);
	};

	return Img ? (
		<label key="" htmlFor="" onClick={onClickSelectContent}>
			<div>
				<img id="conetnt" alt="image-content" />
				<input type="text" />
			</div>
		</label>
	) : null;
};

export default ArchiveContent;
