import {Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import React from "react";
import useSWR from "swr";
import {Router, useRouter} from 'next/router'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Grid from '@mui/material/Grid';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import {removeItemById} from "@/common/utils/array.utils";

const fetcher = (url) => fetch(url).then((res) => res.json());

const CategoryList: React.FC = (): JSX.Element => {
	const router = useRouter();
	const { data, error, isLoading, mutate } = useSWR('/api/get-categories', fetcher);
	if(isLoading) return  <div>Загрузка категорий</div>
	if(error) return  <div>Ошибка при поиске категорий</div>
	if(!data || data.length < 0) return  <div>Нет категорий</div>

	// Выбор категории
	const onSelected = (categoryId) => {
		router.push(`/words/${categoryId}`);
	}

	// Удалить категорию
	const onDeleteCategory = (categoryId) => {
		const result = window.confirm('Вы подтверждаете удаление категории?');
		if(result) {
			axios.delete(`/api/delete-category?id=${categoryId}`).then(() => {
				removeItemById(data, categoryId);
				// Изменяем данные пришедшие с сервера
				mutate([...data]);
			}).catch((error) => {
				console.error(error);
				alert('При удалении произошла ошибка');
			})
		}
	}

	return (
				<Grid sx={{ flexGrow: 1 }} container spacing={2}>
					<Grid item xs={12}>
						<Grid container justifyContent="center" spacing={2}>
							{data.map((category) => {
								const all = Number(category.complete) + Number(category.not_complete);
								const complete = category.complete;
								const allComplete = all === complete;
								return (
									<Grid key={category.id} item>
										<Card sx={{minWidth: '200px', background: allComplete ? '#e6ffe6' : '#f4f4f4', position: 'relative'}}>
											<CardContent>
												<IconButton aria-label="delete" size="small" sx={{position: 'absolute', right: '10px', top: '10px'}} onClick={() => {onDeleteCategory(category.id)}}><DeleteForeverIcon /></IconButton>
												{allComplete && <DoneIcon color="success" sx={{position: 'absolute', right: '10px', bottom: '10px'}}/>}
												<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
													Программа
												</Typography>
												<Typography variant="h5" component="div">
													{category.title}
												</Typography>
												<Typography variant="body2">
													Пройдено: {complete} из {all}
												</Typography>
											</CardContent>
											<CardActions sx={{justifyContent: 'space-between'}}>
												<Button size="small" onClick={() => {
													router.push(`/words/${category.id}`);
												}}>Edit</Button>
												{!allComplete && (
														<Button size="small" color="success" variant="outlined" onClick={() => {
															router.push(`/play/${category.id}`);
														}}>Start</Button>
												)}
											</CardActions>
										</Card>
									</Grid>
							)})}

							<Grid item>
								<Card sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									minWidth: '100px',
									background: '#ffffff',
									position: 'relative',
									height: '100%',
									border: '1px dashed #ccc',
									cursor: 'pointer',
									boxShadow: 'none'
								}}
								onClick={() => {router.push('/words/add')}}
								>
									<AddIcon sx={{color: '#ccc'}} fontSize="large"/>
								</Card>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
	)
}
export default CategoryList;
