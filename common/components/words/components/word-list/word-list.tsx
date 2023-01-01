import {FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import WordItem from "@/components/words/components/word-item/word-item";
import Grid from "@mui/material/Grid";
import React, {useEffect, useState} from "react";
import useSWR from 'swr'
import CategorySelect from "@/components/words/components/category-select/category-select";
const fetcher = (url) => fetch(url).then((res) => res.json());

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	boxShadow: 'none',
	borderBottom: '1px solid #eee',
	":hover": {background: '#eee', cursor: 'pointer'},
}));

const WordList: React.FC = (): JSX.Element => {
	const { data, error, isLoading } = useSWR('/api/get-words', fetcher);

	return (
			<>
				<Grid container direction="row">
					<Grid item xs={3} md={3}>
						<CategorySelect />
					</Grid>
					<Grid item xs={9} md={9}>
						<TextField
								fullWidth
								hiddenLabel
								label="Поиск"
						/>
					</Grid>
				</Grid>

				<Stack sx={{ border: '1px solid #ccc', minHeight: '300px',maxHeight: '490px', overflow: 'auto', width: '100%' }}>
					{error && <div>Произошла ошибка!</div>}
					{isLoading && <div>Загрузка!</div>}
					{data && data.map((itemData) => (
						<Item key={itemData.id}><WordItem data={itemData} /></Item>
					))}
					{data && data.length <= 0 && <div>Нет данных</div>}
				</Stack>
			</>
	)
}
export default WordList;