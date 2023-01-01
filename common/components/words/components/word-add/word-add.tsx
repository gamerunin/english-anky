import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import {Box, Button, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DoneIcon from '@mui/icons-material/Done';
import React, {useEffect} from "react";
import CategorySelect from "@/components/words/components/category-select/category-select";

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	boxShadow: 'none'
}));

const WordAdd: React.FC = (): JSX.Element => {
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
							/>
						</Item>
					</Grid>
					<Grid item xs="auto">
						<Item>
							<CategorySelect />
						</Item>
					</Grid>
				</Grid>
				<Box sx={{marginTop: '20px'}}>
					<Button variant="contained" color='success' size="large">Добавить <DoneIcon /></Button>
				</Box>
			</>
	)
}
export default WordAdd;
