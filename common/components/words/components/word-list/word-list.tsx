import {Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import React, {useEffect, useState} from "react";
import useSWR  from 'swr'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Word} from "@/common/types/word.type";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CancelIcon from '@mui/icons-material/Cancel';
import {useDetectClickOutside} from "react-detect-click-outside";
import axios from "axios";
import {getItemById, removeItemById} from "@/common/utils/array.utils";
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

interface WordListProps {
	category: string;
}

const WordList: React.FC<WordListProps> = ({ category }): JSX.Element => {
	const { data, error, isLoading, mutate } = useSWR(`/api/get-words?category=${category}`, fetcher);
	const [edited, setEdited] = useState(null);
	const [isFormAdd, setFormAdd] = useState(false);
	const [formData, setFormData] = useState({} as Word);

	// Нажатие вне блока
	const ref = useDetectClickOutside({
		onTriggered: (e) => {
			setFormAdd(false);
			// @ts-ignore
			if(e.target?.tagName === 'svg' || e.target?.tagName === 'path') return;
			setEdited(null);
		}
	});

	// сохранение формы
	const onSave = () => {
		// Редактирование
		if(formData?.id) {
			axios.patch('/api/edit-word', { ...formData, category_id: category}).then(() => {
				setEdited(null);
				setFormData({} as Word);
				// Обновляем данные в списке
				const item = getItemById(data, formData.id);
				if(item) {
					item.question = formData.question;
					item.answer = formData.answer;
					item.repeats = formData.repeats;
					item.wrongs = formData.wrongs;
				}
				// Изменяем данные пришедшие с сервера
				mutate([...data]);
			}).catch(() => {
				alert('Произошла ошибка при сохранении')
			})
		}
		// Новый элемент создание
		else {
			axios.patch('/api/create-word', {...formData, category_id: category}).then((response) => {
				setEdited(null);
				setFormAdd(false);
				setFormData({} as Word);
				// Добавляем новый элемент в список сразу
				data.push({...formData, id: response?.data?.insertId || -1, category_id: category})
				mutate([...data]);
			}).catch(() => {
				alert('Произошла ошибка при создании')
			})
		}
	}

	// Добавление
	const onAdd = () => {
		setFormData({
			question: '',
			answer: '',
			repeats: '3',
			wrongs: '0',
		} as Word);
		setEdited(null);
		setFormAdd(true);
	}

	// Удаление
	const onDelete = (formId) => {
		axios.delete(`/api/delete-word?id=${formId}`).then(() => {
			removeItemById(data, formId);
			// Изменяем данные пришедшие с сервера
			mutate([...data]);
		}).catch((error) => {
			console.error(error);
			alert('При удалении произошла ошибка');
		})
	}

	// Редактирование
	const onEdit = (rowData: Word) => {
		setEdited(rowData.id);
		setFormData(rowData);
	}

	if(error || isLoading) return  null;

	return (
			<>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table" ref={ref}>
						<TableHead>
							<TableRow>
								<TableCell padding="checkbox">
									<IconButton aria-label="add" size="small" color="success" onClick={onAdd} >
										<ControlPointIcon fontSize="inherit" />
									</IconButton>
								</TableCell>
								<TableCell>
									Вопрос
								</TableCell>
								<TableCell>Ответ</TableCell>
								<TableCell align="right">Повторы</TableCell>
								<TableCell align="right">Ошибки</TableCell>
								<TableCell align="right"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{isFormAdd && (
									<TableRow
											sx={{
												'&:last-child td, &:last-child th': { border: 0 },
												background: '#fdffec'
											}}
									>
										<TableCell padding="checkbox"><IconButton aria-label="edit" size="small" color="success" onClick={onSave}><DoneIcon fontSize="inherit" /></IconButton></TableCell>
										<TableCell component="th" scope="row">
											<TextField
													fullWidth
													hiddenLabel
													size="small"
													value={formData.question}
													onChange={(e) => setFormData({...formData, question: e.target.value})}
											/>
										</TableCell>
										<TableCell>
											<TextField
													fullWidth
													hiddenLabel
													size="small"
													value={formData.answer}
													onChange={(e) => setFormData({...formData, answer: e.target.value})}
											/>
										</TableCell>
										<TableCell align="right">
											<TextField
													sx={{maxWidth: '55px'}}
													hiddenLabel
													size="small"
													value={formData.repeats}
													onChange={(e) => setFormData({...formData, repeats: e.target.value})}
											/>
										</TableCell>
										<TableCell align="right">
											<TextField
													sx={{maxWidth: '55px'}}
													hiddenLabel
													size="small"
													value={formData.wrongs}
													onChange={(e) => setFormData({...formData, wrongs: e.target.value})}
											/>
										</TableCell>
										<TableCell align="right" padding="checkbox">
											<IconButton aria-label="edit" size="small" onClick={() => {
													setFormAdd(false);
											}}>
												<CancelIcon fontSize="inherit" />
											</IconButton>
										</TableCell>
									</TableRow>
							)}
							{data.map((row: Word) => (
									<TableRow
											key={row.id}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
											hover
									>
										<TableCell>
											{edited === row.id && <IconButton aria-label="edit" size="small" color="success" onClick={onSave}><DoneIcon fontSize="inherit" /></IconButton>}
											{edited !== row.id && <IconButton aria-label="edit" size="small" color="warning" onClick={() => onEdit(row)}><EditIcon fontSize="inherit" /></IconButton>}
										</TableCell>
										<TableCell component="th" scope="row">
											{edited !== row.id && row.question}
											{edited === row.id && (
													<TextField
															fullWidth
															hiddenLabel
															size="small"
															value={formData.question}
															onChange={(e) => setFormData({...formData, question: e.target.value})}
													/>
											)}
										</TableCell>
										<TableCell>
											{edited !== row.id && row.answer}
											{edited === row.id && (
													<TextField
															fullWidth
															hiddenLabel
															size="small"
															value={formData.answer}
															onChange={(e) => setFormData({...formData, answer: e.target.value})}
													/>
											)}
										</TableCell>
										<TableCell align="right">
											{edited !== row.id && row.repeats}
											{edited === row.id && (
													<TextField
															sx={{maxWidth: '55px'}}
															hiddenLabel
															size="small"
															value={formData.repeats}
															onChange={(e) => setFormData({...formData, repeats: e.target.value})}
													/>
											)}
										</TableCell>
										<TableCell align="right">
											{edited !== row.id && row.wrongs}
											{edited === row.id && (
													<TextField
															sx={{maxWidth: '55px'}}
															hiddenLabel
															size="small"
															value={formData.wrongs}
															onChange={(e) => setFormData({...formData, wrongs: e.target.value})}
													/>
											)}
										</TableCell>
										<TableCell align="right" padding="checkbox"><IconButton aria-label="edit" size="small" color="error" onClick={() => onDelete(row.id)}><DeleteForeverIcon fontSize="inherit" /></IconButton></TableCell>
									</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				</>
	)
}
export default WordList;