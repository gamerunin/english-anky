import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import { useRouter } from 'next/router'
import WordList from "@/components/word-list/word-list";
import useSWR from "swr";
import EditIcon from '@mui/icons-material/Edit';
import {IconButton, TextField} from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import axios from "axios";
const fetcher = (url) => fetch(url).then((res) => res.json());

const theme = createTheme();

const WordListPage: React.FC = (): JSX.Element => {
	const router = useRouter();
	const { id } = router.query;
	const { data, mutate } = useSWR(`/api/get-category?id=${id}`, fetcher);
	const [formTitle, setFormTitle] = useState('');
	const [isEdit, setEdit] = useState(false);

	useEffect(() => {
		if(data?.title) {
			setFormTitle(data.title);
		}
	}, [data])

	// Сохранение заголовка
	const onSaveTitle = () => {
		setEdit(false);
		axios.patch('/api/edit-category', {id, title: formTitle}).catch(() => {
			alert('Произошла ошибка сохранения');
		})
	}

	return (
			<ThemeProvider theme={theme}>
				<Container component="main">
					<CssBaseline />
					<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
					>
						{data &&
							<>
							{isEdit &&
								<Box sx={{display: 'flex', marginTop: '20px', marginBottom: '30px'}}>
									<TextField
										hiddenLabel
										size="small"
										value={formTitle}
										onChange={(e) => setFormTitle(e.target.value)}
										/>
										<IconButton sx={{marginLeft: '10px'}} aria-label="edit" size="small" color="success" onClick={onSaveTitle}><DoneIcon /></IconButton>
								</Box>
							}
							{!isEdit &&
								<Typography component="h1" variant="h4" sx={{ marginTop: '10px', marginBottom: '30px' }}>
									{formTitle}
									<IconButton sx={{marginLeft: '10px'}} aria-label="edit" size="small" onClick={() => setEdit(true)}><EditIcon /></IconButton>
								</Typography>
							}
							</>
						}
						<WordList category={String(id)} />
					</Box>
				</Container>
			</ThemeProvider>
	)
}
export default WordListPage;