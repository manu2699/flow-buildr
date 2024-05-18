import { memo } from "react";
import { Handle, Position } from "reactflow";
import { BiMessageDetail } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";

function CustomNodeComponent({ data }) {
	// Render custom node based on type...

	switch (data.type) {
		case "Message":
			return <MessageNode data={data} />;
		default:
			return <DefaultNode data={data} />;
	}
}

function DefaultNode({ data }) {
	return (
		<div className='bg-blue-500 p-2 rounded-md'>
			<Handle type='target' position={Position.Top} />
			<div>{data.label}</div>
			<Handle type='source' position={Position.Bottom} />
		</div>
	);
}

function MessageNode({ data }) {
	return (
		<div className='bg-white shadow-md rounded-md overflow-hidden min-w-[200px]'>
	
			<div className='w-full p-1 px-2 flex gap-1 items-center bg-blue-200 text-sm font-semibold relative'>
				<BiMessageDetail />
				<div className='w-[75%]'>Send Message</div>
				<div>
					{data.vendor === "Whatsapp" ? (
						<FaWhatsapp className='text-green-600' />
					) : null}
				</div>
			</div>
			<div className='p-4 text-xs'>{data.label}</div>

			<Handle
				type='target'
				position={Position.Left}
				className='h-2 w-2 !bg-black'
			/>
			<Handle
				type='source'
				position={Position.Right}
				className='h-2 w-2 !bg-black'
			/>
		</div>
	);
}

export const CustomNode = memo(CustomNodeComponent);
