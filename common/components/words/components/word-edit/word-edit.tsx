import Grid from '@mui/material/Grid';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Box, Button} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DoneIcon from '@mui/icons-material/Done';
import React, {useEffect, useState} from "react";
import CategorySelect from "@/components/words/components/category-select/category-select";
import {Word} from "@/common/types/word.type";
import useSWR from "swr";
import axios from "axios";
import Router from "next/router";

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	boxShadow: 'none'
}));

const fetcher = (url) => fetch(url).then((res) => res.json());

interface WordAddProps {
	id: number;
}

const WordEdit: React.FC<WordAddProps> = ({id}): JSX.Element => {
	const {data, error, isLoading} = useSWR(`/api/get-word?id=${id}`, fetcher);
	const [formData, setFormData] = useState({
		question: '',
		answer: '',
		repeats: '',
		wrongs: '',
		category_id: 0
	} as Word);

	useEffect(() => {
		if(data?.id) {
			setFormData({
				id: data.id,
				question: data.question,
				answer: data.answer,
				repeats: data.repeats,
				wrongs: data.wrongs,
				category_id: data.category_id,
			})
		}
	}, [data])

	if(isLoading) return <div>Загрузка...</div>;
	if(error) return <div>Ошибка...</div>;

	// Сохранение данных
	const onSubmit = (e) => {
		if(!formData.question || !formData.answer || !formData.category_id) return;

		e.preventDefault()
			const res = axios.patch('/api/edit-word', formData).then(() => {
				Router.push('/words')
			}).catch(() => {
				alert('Произошла ошибка при сохранении')
			})
	}

	return (
			<>
				<Grid
						container
						spacing={1}
						direction="row"
						justifyContent="center"
						alignItems="center"
				>
					<Grid item xs={5} md={5}>
						<Item>
							<TextField
									fullWidth
									label="Фраза на английском"
									multiline
									rows={3}
									value={formData.question}
									onChange={(e) => {
										setFormData({
											...formData,
											question: e.target.value,
										})
									}}
							/>
						</Item>
					</Grid>
					<Grid item xs="auto">
						<Item><Button variant="contained"><ArrowForwardIosIcon /></Button></Item>
					</Grid>
					<Grid item xs={5} md={5}>
						<Item>
							<TextField
								fullWidth
								label="Перевод фразы"
								multiline
								rows={3}
								value={formData.answer}
								onChange={(e) => {
									setFormData({
										...formData,
										answer: e.target.value,
									})
								}}
						/></Item>
					</Grid>
				</Grid>

				<Grid
						container
						spacing={1}
						direction="row"
						justifyContent="center"
						alignItems="center"
						sx={{marginTop: '20px'}}
				>
					<Grid item xs="auto">
						<Item>
							<TextField
									sx={{maxWidth: '100px'}}
									type="number"
									id="outlined-basic"
									label="Ошибки"
									variant="outlined"
									value={formData.wrongs}
									onChange={(e) => {
										setFormData({
											...formData,
											wrongs: e.target.value,
										})
									}}
							/>
						</Item>
					</Grid>
					<Grid item xs="auto">
						<Item>
							<TextField
									sx={{maxWidth: '100px'}}
									type="number"
									id="outlined-basic"
									label="Повторы"
									variant="outlined"
									value={formData.repeats}
									onChange={(e) => {
										setFormData({
											...formData,
											repeats: e.target.value,
										})
									}}
							/>
						</Item>
					</Grid>
					<Grid item xs="auto">
						<Item>
							<CategorySelect value={formData.category_id} onChange={(id) => {
								setFormData({
									...formData,
									category_id: Number(id),
								})
							}} />
						</Item>
					</Grid>
				</Grid>
				<Box sx={{marginTop: '20px'}}>
					<Button onClick={onSubmit} variant="contained" color='secondary' size="large">Редактировать<DoneIcon /></Button>
				</Box>
			</>
	)
}
export default WordEdit;
