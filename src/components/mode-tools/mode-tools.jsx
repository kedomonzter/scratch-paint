import paper from '@scratch/paper';
import classNames from 'classnames';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import {changeBrushSize} from '../../reducers/brush-mode';
import {changeBrushSize as changeEraserSize} from '../../reducers/eraser-mode';
import {changeBitBrushSize} from '../../reducers/bit-brush-size';

import LiveInputHOC from '../forms/live-input-hoc.jsx';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import Input from '../forms/input.jsx';
import InputGroup from '../input-group/input-group.jsx';
import LabeledIconButton from '../labeled-icon-button/labeled-icon-button.jsx';
import Modes from '../../lib/modes';
import Formats from '../../lib/format';
import {isBitmap, isVector} from '../../lib/format';
import styles from './mode-tools.css';

import copyIcon from './icons/copy.svg';
import pasteIcon from './icons/paste.svg';

import bitBrushIcon from '../bit-brush-mode/brush.svg';
import bitLineIcon from '../bit-line-mode/line.svg';
import brushIcon from '../brush-mode/brush.svg';
import curvedPointIcon from './icons/curved-point.svg';
import eraserIcon from '../eraser-mode/eraser.svg';
import flipHorizontalIcon from './icons/flip-horizontal.svg';
import flipVerticalIcon from './icons/flip-vertical.svg';
import straightPointIcon from './icons/straight-point.svg';

import {MAX_STROKE_WIDTH} from '../../reducers/stroke-width';

const LiveInput = LiveInputHOC(Input);
const ModeToolsComponent = props => {
    const messages = defineMessages({
        brushSize: {
            defaultMessage: 'Brush size',
            description: 'Label for the brush size input',
            id: 'paint.modeTools.brushSize'
        },
        lineSize: {
            defaultMessage: 'Line size',
            description: 'Label for the line size input',
            id: 'paint.modeTools.lineSize'
        },
        eraserSize: {
            defaultMessage: 'Eraser size',
            description: 'Label for the eraser size input',
            id: 'paint.modeTools.eraserSize'
        },
        copy: {
            defaultMessage: 'Copy',
            description: 'Label for the copy button',
            id: 'paint.modeTools.copy'
        },
        paste: {
            defaultMessage: 'Paste',
            description: 'Label for the paste button',
            id: 'paint.modeTools.paste'
        },
        curved: {
            defaultMessage: 'Curved',
            description: 'Label for the button that converts selected points to curves',
            id: 'paint.modeTools.curved'
        },
        pointed: {
            defaultMessage: 'Pointed',
            description: 'Label for the button that converts selected points to sharp points',
            id: 'paint.modeTools.pointed'
        },
        flipHorizontal: {
            defaultMessage: 'Flip Horizontal',
            description: 'Label for the button to flip the image horizontally',
            id: 'paint.modeTools.flipHorizontal'
        },
        flipVertical: {
            defaultMessage: 'Flip Vertical',
            description: 'Label for the button to flip the image vertically',
            id: 'paint.modeTools.flipVertical'
        }
    });

    switch (props.mode) {
    case Modes.BRUSH:
        /* falls through */
    case Modes.BIT_BRUSH:
        /* falls through */
    case Modes.BIT_LINE:
    {
        const currentIcon = isVector(props.format) ? brushIcon :
            props.mode === Modes.BIT_LINE ? bitLineIcon : bitBrushIcon;
        const currentBrushValue = isBitmap(props.format) ? props.bitBrushSize : props.brushValue;
        const changeFunction = isBitmap(props.format) ? props.onBitBrushSliderChange : props.onBrushSliderChange;
        const currentMessage = props.mode === Modes.BIT_LINE ? messages.lineSize : messages.brushSize;
        return (
            <div className={classNames(props.className, styles.modeTools)}>
                <div>
                    <img
                        alt={props.intl.formatMessage(currentMessage)}
                        className={styles.modeToolsIcon}
                        draggable={false}
                        src={currentIcon}
                    />
                </div>
                <LiveInput
                    range
                    small
                    max={MAX_STROKE_WIDTH}
                    min="1"
                    type="number"
                    value={currentBrushValue}
                    onSubmit={changeFunction}
                />
            </div>
        );
    }
    case Modes.ERASER:
        return (
            <div className={classNames(props.className, styles.modeTools)}>
                <div>
                    <img
                        alt={props.intl.formatMessage(messages.eraserSize)}
                        className={styles.modeToolsIcon}
                        draggable={false}
                        src={eraserIcon}
                    />
                </div>
                <LiveInput
                    range
                    small
                    max={MAX_STROKE_WIDTH}
                    min="1"
                    type="number"
                    value={props.eraserValue}
                    onSubmit={props.onEraserSliderChange}
                />
            </div>
        );
    case Modes.RESHAPE:
        return (
            <div className={classNames(props.className, styles.modeTools)}>
                <LabeledIconButton
                    disabled={!props.hasSelectedUncurvedPoints}
                    imgSrc={curvedPointIcon}
                    title={props.intl.formatMessage(messages.curved)}
                    onClick={props.onCurvePoints}
                />
                <LabeledIconButton
                    disabled={!props.hasSelectedUnpointedPoints}
                    imgSrc={straightPointIcon}
                    title={props.intl.formatMessage(messages.pointed)}
                    onClick={props.onPointPoints}
                />
            </div>
        );
    case Modes.SELECT:
        return (
            <div className={classNames(props.className, styles.modeTools)}>
                <InputGroup className={classNames(styles.modDashedBorder, styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        disabled={!props.selectedItems.length}
                        imgSrc={copyIcon}
                        title={props.intl.formatMessage(messages.copy)}
                        onClick={props.onCopyToClipboard}
                    />
                    <LabeledIconButton
                        disabled={!(props.clipboardItems.length > 0)}
                        imgSrc={pasteIcon}
                        title={props.intl.formatMessage(messages.paste)}
                        onClick={props.onPasteFromClipboard}
                    />
                </InputGroup>
                <InputGroup className={classNames(styles.modLabeledIconHeight)}>
                    <LabeledIconButton
                        imgSrc={flipHorizontalIcon}
                        title={props.intl.formatMessage(messages.flipHorizontal)}
                        onClick={props.onFlipHorizontal}
                    />
                    <LabeledIconButton
                        imgSrc={flipVerticalIcon}
                        title={props.intl.formatMessage(messages.flipVertical)}
                        onClick={props.onFlipVertical}
                    />
                </InputGroup>
            </div>
        );
    default:
        // Leave empty for now, if mode not supported
        return (
            <div className={classNames(props.className, styles.modeTools)} />
        );
    }
};

ModeToolsComponent.propTypes = {
    bitBrushSize: PropTypes.number,
    brushValue: PropTypes.number,
    className: PropTypes.string,
    clipboardItems: PropTypes.arrayOf(PropTypes.array),
    eraserValue: PropTypes.number,
    format: PropTypes.oneOf(Object.keys(Formats)).isRequired,
    hasSelectedUncurvedPoints: PropTypes.bool,
    hasSelectedUnpointedPoints: PropTypes.bool,
    intl: intlShape.isRequired,
    mode: PropTypes.string.isRequired,
    onBitBrushSliderChange: PropTypes.func.isRequired,
    onBrushSliderChange: PropTypes.func.isRequired,
    onCopyToClipboard: PropTypes.func.isRequired,
    onCurvePoints: PropTypes.func.isRequired,
    onEraserSliderChange: PropTypes.func,
    onFlipHorizontal: PropTypes.func.isRequired,
    onFlipVertical: PropTypes.func.isRequired,
    onPasteFromClipboard: PropTypes.func.isRequired,
    onPointPoints: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.instanceOf(paper.Item))
};

const mapStateToProps = state => ({
    mode: state.scratchPaint.mode,
    format: state.scratchPaint.format,
    bitBrushSize: state.scratchPaint.bitBrushSize,
    brushValue: state.scratchPaint.brushMode.brushSize,
    clipboardItems: state.scratchPaint.clipboard.items,
    eraserValue: state.scratchPaint.eraserMode.brushSize,
    selectedItems: state.scratchPaint.selectedItems
});
const mapDispatchToProps = dispatch => ({
    onBrushSliderChange: brushSize => {
        dispatch(changeBrushSize(brushSize));
    },
    onBitBrushSliderChange: bitBrushSize => {
        dispatch(changeBitBrushSize(bitBrushSize));
    },
    onEraserSliderChange: eraserSize => {
        dispatch(changeEraserSize(eraserSize));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(ModeToolsComponent));
