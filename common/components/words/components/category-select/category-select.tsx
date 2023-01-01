import {Box, Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React, {useEffect, useState} from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

interface CategorySelectProps {
	value?: number;
	onChange?: (e) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }): JSX.Element => {
	const { data, error, isLoading } = useSWR('/api/get-categories', fetcher);

	if(isLoading) return  <div>Загрузка категорий</div>
	if(error) return  <div>Ошибка при поиске категорий</div>
	if(!data || data.length < 0) return  <div>Нет категорий</div>

	// Выбор категории
	const getSelected = () => {
		if(!data || data.length <= 0) return 0;

		// категория пришедшая
		if(value) {
			const element = data.find((category) => category.id === value);
			if(element) return element.id;
		}

		// Первая по умолчанию
		return  data[0].id;
	}

	return (
			<>
				<FormControl sx={{minWidth: '250px', textAlign: 'left'}}>
					<InputLabel id="demo-simple-select-label">Категория</InputLabel>
					<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							label="Категория"
							value={getSelected()}
							onChange={(e) => {
								onChange(e.target.value);
							}}
					>
						{data.map((category) => (
								<MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>
						))}
					</Select>
				</FormControl>
			</>
	)
}
export default CategorySelect;
