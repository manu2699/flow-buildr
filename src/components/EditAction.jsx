import React, { useState } from "react";

import { IoMdArrowRoundBack } from "react-icons/io";

export const EditAction = React.memo(({ node, onBack, onEdit }) => {
	function handleNodeDataChange(key, value) {
		onEdit(node.id, { data: { ...node.data, [key]: value } });
	}

	return (
		<div className='w-[300px] border-l h-full'>
			{/* Settings header */}
			<div className='w-full p-2 flex items-center border-b'>
				<div role='button' aria-label='back-button' onClick={onBack}>
					<IoMdArrowRoundBack />
				</div>
				<div className='w-full text-center'>{node.data.type}</div>
			</div>

			{/* Settings content */}
			{/* Render action editor based on type */}
			<div className='p-2 flex flex-col'>
				{node.data.type === "Message" ? (
					<EditMessageNode
						node={node}
						onChange={handleNodeDataChange}
					/>
				) : null}
			</div>
		</div>
	);
});

const EditMessageNode = ({ node, onChange }) => {
	let [message, setMessage] = useState(node.data.label);

	return (
		<textarea
			className='border rounded-md p-2  focus-visible:border-gray-200'
			value={message}
			onChange={(e) => setMessage(e.target.value)}
			onBlur={(e) => onChange("label", e.target.value)}
		/>
	);
};
