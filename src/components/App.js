import React, { Component } from 'react';
import '../assets/styles/App.css';
import Button from '@material-ui/core/Button';
import Task from '../models/task.model';
import { AppBar, Toolbar, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableRow, TableBody, IconButton, Chip, InputAdornment, Grid, TableHead, TableCell } from '@material-ui/core';
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

    events: []
  };

  componentDidMount() {
    fetch("https://5c9299d2e7b1a00014078e33.mockapi.io/api/events")
      .then(res => res.json())
      .then(
        (result) => {
          result.map(event => {
            event.time = new Date(event.time * 1000);
            event.during = new Date(event.during * 1000);
            event.reminder = new Date(event.reminder * 1000);
            event.created = new Date(event.created * 1000);
          })
          this.setState({
            events: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

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

  getFieldData = () => {
    let task = new Task();
    task.description = this.state.description;
    task.time = new Date(this.state.time);
    task.during = new Date(this.state.during);
    task.reminder = new Date(this.state.reminder);
    task.tags = this.state.tags;
    return task;
  }

  handleCreate = () => {
    this.state.events.push(this.getFieldData());
    this.setState({ open: false });
  };

  handleEdit = () => {

    let eventIndex = this.state.events.findIndex(task => task === this.state.event);

    if (eventIndex > -1) {
      this.state.events[eventIndex] = this.getFieldData();
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
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Descrição</TableCell>
                    <TableCell align="right">Inicio da tarefa</TableCell>
                    <TableCell align="right">Duração da tarefa</TableCell>
                    <TableCell align="right">Lembrete</TableCell>
                    <TableCell align="right">Criado em</TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {this.state.events.map(event => {
                    return (
                      <TableRow key={event.id}>
                        <TableCell component="th" scope="row">{event.description}</TableCell>
                        <TableCell align="right" >{event.time.toLocaleString()}</TableCell>
                        <TableCell align="right" >{event.during.toLocaleString()}</TableCell>
                        <TableCell align="right" >{event.reminder.toLocaleString()}</TableCell>
                        <TableCell align="right" >{event.created.toLocaleString()}</TableCell>
                        <TableCell align="right" >
                          <IconButton
                            aria-label="Edit"
                            onClick={() => this.handleOpenEdit(event)}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell align="right" >
                          <IconButton
                            aria-label="Delete"
                            onClick={() => this.handleDeleteEvent(event)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
