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
	const [formTitle, setFormTitle] = useState('');
	const [isEdit, setEdit] = useState(true);
	const [formId, setFormId] = useState('');

	// Создание категорий
	const onSaveTitle = () => {
		setEdit(false);
		axios.patch('/api/create-category', {title: formTitle})
			.then((response) => {
				setEdit(false);
				setFormId(response?.data?.insertId);
			})
			.catch(() => {
				alert('Произошла ошибка создания');
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
							<>
							{isEdit &&
								<Box sx={{display: 'flex', marginTop: '20px', marginBottom: '30px', alignItems: 'center'}}>
									<Typography sx={{marginRight: '20px'}}>Создание категории: </Typography>
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
						{formId && <WordList category={String(formId)} />}
					</Box>
				</Container>
			</ThemeProvider>
	)
}
export default WordListPage;