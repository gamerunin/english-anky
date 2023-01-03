import {useEffect, useState} from 'react';
import axios from 'axios';
import {LoadingStatusEnum} from "@/common/enums/loading-status.enum";

const useAxios = ({ url, params }) => {
	const [data, setResponse] = useState(null);
	const [status, setStatus] = useState(LoadingStatusEnum.IDLE);

	const fetchData = () => {
		axios(url, params)
			.then((res) => {
				const result = res?.data;
				setResponse(result);
				if(!result) {
					setStatus(LoadingStatusEnum.EMPTY);
				} else if((Array.isArray(result) && result.length > 0)) {
					setStatus(LoadingStatusEnum.SUCCESS);
				} else if((Object.keys(result).length !== 0)) {
					setStatus(LoadingStatusEnum.SUCCESS);
				} else {
					setStatus(LoadingStatusEnum.EMPTY);
				}
			})
			.catch((err) => {
				setStatus(LoadingStatusEnum.ERROR);
			})
			.finally(() => {
				setStatus(LoadingStatusEnum.LOADING);
			});
	};

	useEffect(() => {
		fetchData();
	}, []);

	// custom hook returns value
	return { data, status };
};

export default useAxios;