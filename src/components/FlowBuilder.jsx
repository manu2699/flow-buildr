import { useCallback, useState } from "react";
import ReactFlow, {
	useStoreApi,
	useNodesState,
	useEdgesState,
	addEdge
} from "reactflow";

import "reactflow/dist/style.css";

import { CustomNode } from "./CustomNode";
import { ActionList } from "./ActionList";
import { EditAction } from "./EditAction";
import { showToast } from "./Toast";

const nodeTypes = {
	custom: CustomNode
};

export function FlowBuilder({ initNodes, initEdges }) {
	const [reactFlowInstance, setReactFlowInstance] = useState(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
	const [selectedNode, setSelectedNode] = useState({});

	const flowStore = useStoreApi();

	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[]
	);

	const handleDragOver = useCallback((event) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
	}, []);

	const handleDrop = useCallback(
		(event) => {
			event.preventDefault();

			const data = event.dataTransfer.getData("application/reactflow");

			// check if the dropped element is valid
			if (typeof data === "undefined" || !data) {
				return;
			}
			let dropData = JSON.parse(data);
			if (!dropData.type) return;

			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX,
				y: event.clientY
			});

			// Let the id be the length of nodes + 1
			let id = flowStore.getState().getNodes().length + 1;

			const newNode = {
				id: id.toString(),
				type: "custom",
				position,
				data: {
					label: dropData.label,
					type: dropData.type,
					vendor: dropData.vendor
				}
			};

			setNodes((nds) => nds.concat(newNode));
		},
		[reactFlowInstance]
	);

	function handleNodeClick(event, node) {
		setSelectedNode(node);
	}

	function handleNodeEdit(nodeId, { data }) {
		setNodes((nds) =>
			nds.map((node) => {
				if (node.id === nodeId) {
					node.data = data;
				}
				return node;
			})
		);
	}

	function handleSaveChanges() {
		let flowState = reactFlowInstance.toObject();

		// Tried using graph approach,
		// but it had leaf nodes with empty connections!! so left it out..

		const nodeGraph = flowState.nodes.reduce((acc, node) => {
			acc[node.id] = [];
			return acc;
		}, {});

		flowState.edges.forEach((edge) => {
			nodeGraph[edge.source].push(edge.target);
		});

		console.log("Node graph :: ", nodeGraph);

		// Another approach to check if all nodes have targets
		// Get all node ids and target edges & check if all node ids are present in target edges

		const nodeIds = flowState.nodes.map((node) => node.id);
		const targetEdges = flowState.edges.map((edge) => edge.target);

		const noTargetNodes = nodeIds.filter(
			(nodeId) => !targetEdges.includes(nodeId) && nodeId !== "1"
		);

		console.log("Nodes with no targets: ", noTargetNodes);

		if (noTargetNodes.length > 0) {
			showToast({
				type: "error",
				message: "Some nodes have no targets!"
			});
		} else {
			showToast({
				type: "success",
				message: "Changes saved successfully!"
			});
		}

		localStorage.setItem("flowState", JSON.stringify(flowState));
	}

	return (
		<div className='builder'>
			{/* TopNav */}
			<div className='w-full flex border-b bg-gray-100 py-3 px-5'>
				<p className='text-blue-700 font-semibold'>Flow Builder</p>
				<button
					className='ml-auto px-3 py-1 bg-white text-blue-700 text-xs font-semibold border border-blue-700 rounded-md'
					onClick={handleSaveChanges}>
					Save Changes
				</button>
			</div>

			<div className='builderGrid'>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onInit={setReactFlowInstance}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					nodeTypes={nodeTypes}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onNodeClick={handleNodeClick}
					fitView
				/>

				{selectedNode.id ? (
					<EditAction
						node={selectedNode}
						onEdit={handleNodeEdit}
						onBack={() => setSelectedNode({})}
					/>
				) : (
					<ActionList />
				)}
			</div>
		</div>
	);
}
