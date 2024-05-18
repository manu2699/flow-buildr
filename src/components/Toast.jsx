import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// A minimal implementation of a toast component

const Toast = ({ message, type, duration, destory }) => {
	const [showToast, setShowToast] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowToast(false);
		}, duration);

		return () => {
			destory();
			clearTimeout(timer);
		};
	}, [duration]);

	return (
		<div
			className={`fixed top-2 left-[45%] p-2 rounded-lg ${
				type === "success" ? "bg-green-400" : "bg-red-300"
			} ${showToast ? "block" : "hidden"}`}>
			<p className='text-black'>{message}</p>
		</div>
	);
};


function renderComponent(args) {
	const div = document.createElement("div");
	document.body.appendChild(div);

	const root = createRoot(div);
	function destroy() {
		root.unmount();
		document.body.removeChild(div);
	}

	root.render(<Toast {...args} destory={destroy} />);
}

export function showToast({ message, type, duration = 1500 }) {
	return renderComponent({ message, type, duration });
}
