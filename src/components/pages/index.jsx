import React from "react";
import {SketchPicker} from 'react-color';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import emailers from '../../../data/emailers.json';
import sites from '../../../data/sites.json';
// import fetch from "node-fetch";


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.MIN_ID = 1;
        this.MAX_ID = 1000000;
        this.state = {site: '', color: '#fff', emailers: emailers.data, sites: sites.data}
    }

    onFormSubmit = (event) => {
        event.preventDefault();
        const {emailers, color, site} = this.state;
        const newEmailer = {'color': color, 'site': site};

        console.log('newEmailer', newEmailer)
        console.log('emailers.length', emailers.length);


        var formBody = [];
        for (var property in newEmailer) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(newEmailer[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        fetch('/create-emailer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })
            .then(response => {
                emailers.unshift(newEmailer);
                console.log('response', response);
                console.log('emailers.length', emailers.length);
                this.setState({
                    emailers: emailers
                })
            })
            .catch((err) => {

            });
    }

    onColorChangeHandler = (color) => {
        this.setState({color: color.hex});
    };

    onSiteChangeHandler = (event) => {
        this.setState({site: event.target.value});
    }

    getRandomId(str) {
        return str + '-' + (Math.floor(Math.random() * (this.MAX_ID - this.MIN_ID + 1)) + this.MIN_ID);
    }

    render() {
        const {emailers, color, sites, site} = this.state;
        return (
            <div>
                <Typography variant="h4" gutterBottom>
                    Emailer
                </Typography>
                <form onSubmit={this.onFormSubmit}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Color
                            </Typography>
                            <SketchPicker
                                color={color}
                                onChangeComplete={this.onColorChangeHandler}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Site
                            </Typography>
                            <FormControl style={{minWidth: '100%'}}>
                                <InputLabel id="demo-simple-select-label">Site</InputLabel>
                                <Select onChange={this.onSiteChangeHandler} value={site}>
                                    {sites.map(siteName => (
                                        <MenuItem key={siteName.site}
                                                  value={siteName.site}>{siteName.site}</MenuItem>))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type={"submit"} variant="contained" size="large" color="primary">
                                Create Emailer Record
                            </Button>
                        </Grid>
                    </Grid>
                </form>
                <br/><br/><br/><br/><br/>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Site</TableCell>
                                <TableCell align="right">Color</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {emailers.map(row => (
                                <TableRow key={this.getRandomId(row.site)}>
                                    <TableCell component="th" scope="row">
                                        {row.site}
                                    </TableCell>
                                    <TableCell align="right"><Typography color={row.color} variant="subtitle2"
                                                                         gutterBottom><span
                                        style={{color: row.color}}>{row.color}</span></Typography></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }

}

export default Index;