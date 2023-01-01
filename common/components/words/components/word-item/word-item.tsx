import Grid from "@mui/material/Grid";
import {Box, Button, ButtonGroup} from "@mui/material";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';
import React from "react";
import Router from 'next/router'

const Item = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(1),
	textAlign: 'left',
	boxShadow: 'none',
	background: 'none',
}));

interface WordItemProps {
	data: {
		id?: number;
		question: string;
		answer: string;
		wrongs: number;
		repeats: number;
		categoryId: number;
	}
}

const WordItem: React.FC<WordItemProps> = ({data}): JSX.Element => {
	const {id, question, answer, wrongs, repeats, categoryId} = data;
	return (
			<Grid
					container
					direction="row"
					alignItems="center"
			>
				<Grid item xs={5} md={5}>
					<Item>
						{question}
					</Item>
				</Grid>
				<Grid item xs={5} md={5}>
					<Item>
						{answer}
					</Item>
				</Grid>
				<Grid item xs="auto">
					<Item>
						<Box sx={{color: '#818181', display: 'flex'}} alignItems="center">
							<RestartAltIcon sx={{marginRight: '5px'}} /> {repeats}
						</Box>
						<Box sx={{color: '#818181', display: 'flex'}} alignItems="center">
							<ErrorIcon sx={{marginRight: '5px'}} /> {wrongs}
						</Box>
					</Item>
				</Grid>
				<Grid item xs="auto">
					<Item>
						<ButtonGroup aria-label="medium button group">
							<Button
									onClick={() => {
											Router.push(`/words/${id}`);
									}}
									color="secondary">
								<EditIcon />
							</Button>
							<Button color="error"><DeleteForeverIcon /></Button>
						</ButtonGroup>
					</Item>
				</Grid>
			</Grid>
	)
}
export default WordItem;