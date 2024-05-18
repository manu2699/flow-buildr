import { useState, useEffect } from "react";

import { ReactFlowProvider } from "reactflow";
import { FlowBuilder } from "./components/FlowBuilder";

const emptyFlowState = {
	nodes: [],
	edges: []
};

export default function App() {
	const [flowState, setFlowState] = useState({});

	useEffect(function onload() {
		let savedState = localStorage.getItem("flowState");
		if (savedState) {
			savedState = JSON.parse(savedState);
			setFlowState(savedState);
		} else {
			setFlowState(emptyFlowState);
		}
	}, []);

	return (
		<div className='w-full h-full'>
			{flowState.nodes ? (
				<ReactFlowProvider>
					<FlowBuilder
						initEdges={flowState.edges}
						initNodes={flowState.nodes}
					/>
				</ReactFlowProvider>
			) : (
				<div className='flex justify-center items-center w-full h-full'>
					<h1 className='text-3xl'>Loading...</h1>
				</div>
			)}
		</div>
	);
}
