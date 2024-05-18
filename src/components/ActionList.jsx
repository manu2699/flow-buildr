import React, { useState } from "react";
import { BiMessageDetail } from "react-icons/bi";

const ACTIONS = [
	{ id: "1", label: "Send Message", type: "Message", vendor: "Whatsapp" }
	// { id: "2", label: "Facebook", type: "Message", vendor: "Facebook" },
	// { id: "3", label: "Instagram", type: "Message", vendor: "Instagram" }
];

const ActionListComponent = () => {
	const [navItems] = useState(ACTIONS);

	const handleDragStart = (event, item) => {
		event.dataTransfer.setData(
			"application/reactflow",
			JSON.stringify(item)
		);
		event.dataTransfer.effectAllowed = "copy";
	};

	return (
		<div className='w-[300px] border-l p-4 flex flex-wrap gap-[12px] content-start'>
			{navItems.map((item) => (
				<div
					key={item.id}
					className='p-2 border border-blue-700 text-blue-700 rounded-md flex gap-2 flex-col justify-center items-center cursor-pointer'
					style={{ width: "calc(50% - 6px)" }}
					onDragStart={(event) => handleDragStart(event, item)}
					draggable>
					{/* Render action icon based on type....*/}
					{item.type === "Message" ? (
						<span className='text-2xl'>
							<BiMessageDetail />
						</span>
					) : null}

					<span className='text-xs'>{item.label}</span>
				</div>
			))}
		</div>
	);
};

export const ActionList = React.memo(ActionListComponent);
