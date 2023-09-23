import { IconButton, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function QuestionList({questions, deleteQuestionAnwser}) {
  return (
    <List
      sx={{
        width: '100%',
        minWidth: '100%',
      }}
    >
      {questions.map((qa, index) => (
        <ListItem
          secondaryAction={
            <IconButton 
              edge="end" aria-label="delete"
              color="error"
              onClick={() => deleteQuestionAnwser(index)}
            >
              <DeleteIcon />
            </IconButton>
          }
          sx={{
            borderTop: 1,
          }}
        >
          <ListItemText
            key={index}
            primary={qa.question}
            secondary={qa.response}
          />
        </ListItem>
      ))}      
    </List>
  )
}