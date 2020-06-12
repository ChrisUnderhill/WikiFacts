import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
    root: {
        width: 300,
        "text-align": "center",
    },
});

const marks = [
    {
        value: 0,
        label: '50%',
    },
    {
        value: 1,
        label: '75%',
    },
    {
        value: 2,
        label: '90%',
    },
    {
        value: 3,
        label: '95%',
    },
];

const values = [50,75,90,95]

function valuetext(value) {
    return `${value}%`;
}

function valueLabelFormat(value) {
    return marks.findIndex((mark) => mark.value === value) + 1;
}

export default function DiscreteSlider(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography id="discrete-slider-confidence" gutterBottom>
                How confident are you?
            </Typography>
            <Slider
                value={values.indexOf(props.value)}
                valueLabelFormat={valueLabelFormat}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-confidence"
                step={null}
                valueLabelDisplay="off"
                max={3}
                marks={marks}
                onChange={(e,v) => props.onChange(values[v])}
            />
        </div>
    );
}