import {Box, Button, FormControl, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import React, {useEffect, useState} from "react";
import useSWR from "swr";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import {Router, useRouter} from 'next/router'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DoneIcon from '@mui/icons-material/Done';

const fetcher = (url) => fetch(url).then((res) => res.json());

const CategoryList: React.FC = (): JSX.Element => {
	const router = useRouter();
	const { data, error, isLoading } = useSWR('/api/get-categories', fetcher);
	if(isLoading) return  <div>Загрузка категорий</div>
	if(error) return  <div>Ошибка при поиске категорий</div>
	if(!data || data.length < 0) return  <div>Нет категорий</div>

	// Выбор категории
	const onSelected = (categoryId) => {
		router.push(`/words/${categoryId}`);
	}

	const Item = styled(Paper)(({ theme }) => ({
		backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
		...theme.typography.body2,
		padding: theme.spacing(1),
		textAlign: 'center',
		color: theme.palette.text.secondary,
	}));
	console.log(data, 'data');

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
												{allComplete && <DoneIcon color="success" sx={{position: 'absolute', right: '5px', top: '5px',}}/>}
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
						</Grid>
					</Grid>
				</Grid>
	)
}
export default CategoryList;
