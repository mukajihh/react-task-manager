import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import Task from './task.model';
import { AppBar, Toolbar, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, InputAdornment, Grid } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

class App extends Component {

  state = {
    open: false,
    edit: false,
    event: null,
    description: '',
    time: new Date().toISOString().substring(0, 16),
    during: new Date().toISOString().substring(0, 16),
    reminder: new Date().toISOString().substring(0, 16),
    tag: '',
    tags: [],
    events: [{
      id: 1,
      description: "Teste de descrição",
      time: new Date(),
      during: new Date(),
      reminder: new Date(),
      created: new Date(),
      tags: []
    }]
  };

  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleOpen = () => {
    this.clearModalFields();
    this.setState({ open: true });
  };

  handleOpenEdit = (event) => {
    this.setState({
      open: true,
      edit: true,
      event: event,
      description: event.description,
      time: new Date(event.time).toISOString().substring(0, 16),
      during: new Date(event.during).toISOString().substring(0, 16),
      reminder: new Date(event.reminder).toISOString().substring(0, 16),
      tags: event.tags
    })
  };

  handleAddTag = () => {
    this.state.tags.push(this.state.tag);
    this.forceUpdate();
  };

  handleDeleteTag = (tag) => {
    this.state.tags.splice(this.state.tags.findIndex(eventTag => eventTag === tag), 1);
    this.forceUpdate();
  };

  handleClose = () => {
    this.setState({ open: false, edit: false });
  };

  handleCreate = () => {
    let task = new Task();
    task.description = this.state.description;
    task.time = new Date(this.state.time);
    task.during = new Date(this.state.during);
    task.reminder = new Date(this.state.reminder);
    task.tags = this.state.tags;
    this.state.events.push(task);
    this.setState({ open: false });
  };

  handleEdit = () => {

    let eventIndex = this.state.events.findIndex(task => task === this.state.event);

    if (eventIndex > -1) {
      let task = new Task();
      task.description = this.state.description;
      task.time = new Date(this.state.time);
      task.during = new Date(this.state.during);
      task.reminder = new Date(this.state.reminder);
      task.tags = this.state.tags;
      this.state.events[eventIndex] = task;
    }

    this.setState({ open: false, edit: false, event: null });
  };

  handleDeleteEvent = (event) => {
    let eventIndex = this.state.events.findIndex(task => task === event);

    if (eventIndex > -1) {
      this.state.events.splice(eventIndex, 1);
    }

    this.forceUpdate();
  };

  clearModalFields = () => {
    this.setState({
      description: '',
      time: new Date().toISOString().substring(0, 16),
      during: new Date().toISOString().substring(0, 16),
      reminder: new Date().toISOString().substring(0, 16),
      tag: '',
      tags: []
    });
  }

  render() {
    return (
      <div className="App">

        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" >
              React Task Manager
            </Typography>
          </Toolbar>
        </AppBar>

        <main>
          <Grid container spacing={24} justify="flex-end">
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleOpen}
              >
              Criar tarefa
              <AddIcon />
            </Button>
            </Grid>
            <Grid item xs={12}>          
              <List>
                {this.state.events.map(event => {
                  return (
                    <ListItem key>
                      <ListItemText primary="Descrição" secondary={event.description} />
                      <ListItemText primary="Inicio da tarefa" secondary={event.time.toLocaleString() }/>
                      <ListItemText primary="Duração da tarefa" secondary={event.during.toLocaleString() }/>
                      <ListItemText primary="Lembrete" secondary={event.reminder.toLocaleString() }/>
                      <ListItemText primary="Criado em" secondary={event.created.toLocaleString() }/>
                      <ListItemSecondaryAction>
                        <IconButton
                          aria-label="Edit"
                          onClick={() => this.handleOpenEdit(event)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="Delete"
                          onClick={() => this.handleDeleteEvent(event)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
          </Grid>
        </main>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Criar Task</DialogTitle>
          <ValidatorForm
            ref="form"
            onSubmit={this.state.edit ? this.handleEdit : this.handleCreate}
          >
            <DialogContent>
              <TextValidator
                required
                fullWidth
                ref="description"
                name="description"
                value={this.state.description}
                label="Descrição"
                validators={['required', 'minStringLength:1']}
                errorMessages={['Digite uma descrição', 'Digite uma descrição']}
                onChange={this.handleChange('description')}
              />
              <TextValidator
                required
                fullWidth
                ref="time"
                name="time"
                value={this.state.time}
                margin="dense"
                label="Data e hora de inicio"
                validators={['required', 'minStringLength:1']}
                errorMessages={['Digite uma data e hora de inicio', 'Digite uma data e hora de inicio']}
                type="datetime-local"
                onChange={this.handleChange('time')}
                />
              <TextValidator
                required
                fullWidth
                ref="during"
                name="during"
                value={this.state.during}
                margin="dense"
                label="Data e hora de fim (previsto)"
                validators={['required', 'minStringLength:1']}
                errorMessages={['Digite uma duração', 'Digite uma duração']}
                type="datetime-local"
                onChange={this.handleChange('during')}
                />
              <TextField
                fullWidth
                margin="dense"
                value={this.state.reminder}
                id="reminder"
                label="Data e hora para alerta"
                type="datetime-local"
                onChange={this.handleChange('reminder')}
                />
              <TextField
                margin="dense"
                value={this.state.tag}
                id="tag"
                label="Tag"
                onChange={this.handleChange('tag')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={this.handleAddTag}
                      >
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {this.state.tags.map(tag => {
                return (
                <Chip
                  label={tag}
                  onDelete={() => this.handleDeleteTag(tag)}
                  color="primary"
                  variant="outlined"
                />
                );
              })}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancelar
              </Button>
              <Button onClick={() => this.refs.form.submit()} color="primary">
                {this.state.edit ? "Salvar" : "Criar"}
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>

      </div>
    );
  }
}

export default App;
