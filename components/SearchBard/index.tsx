import { SearchIcon } from "@heroicons/react/outline";
import React from "react";

const SearchBar = () => {
	return (
		<div className="mt-1 relative rounded-md shadow-sm">
			<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<SearchIcon
					className="h-5 w-5 text-gray-400"
					aria-hidden="true"
				/>
			</div>
			<input
				type="text"
				name="text"
				id="text"
				className="block w-full pl-10 sm:text-sm text-primaryText border-transparent rounded-md bg-primaryBackground"
				placeholder="Search your emails"
			/>
		</div>
	);
};

export default SearchBar;
