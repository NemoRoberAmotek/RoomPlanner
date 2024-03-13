import { useRoom } from "../../contexts/RoomProvider"
import { useAction } from "../../contexts/ActionProvider"
import {
    capitalizeString,
    tryToInteger,
    tryToFloat,
} from "../../helpers/strings.js"
import { useGlobalSettings } from "../../contexts/GlobalSettingsProvider"
import useComputation from "../../hooks/useComputation"
import { useState, useEffect, useCallback } from "react"
import { Icon } from "@iconify/react"
import useConvertUnits from "../../hooks/useConvertUnits"
import { v4 as uuidv4 } from "uuid"
import getTextures from "../../helpers/getTextures"

const FurnitureProperties = () => {
    const [formWarning, setFormWarning] = useState()
    const [initialValues, setInitialValues] = useState({})

    const { units } = useGlobalSettings()
    const { convertUnits, getUnitName } = useConvertUnits(units)

    const {
        selectedFurniture,
        room,
        setSelectedFurniture,
        rotateFurniture,
        setFurnitureZIndex,
        updateRoomFurniture,
        removeFurniture,
        duplicateFurniture,
    } = useRoom()

    const { setAction } = useAction()
    const { snapToRoom } = useComputation({}, room)

    const [width, setWidth] = useState(0)

    const [length, setLength] = useState(0)

    const { textures } = getTextures()

    useEffect(() => {
        setLength(selectedFurniture.length)
        setWidth(selectedFurniture.width)
    }, [selectedFurniture])

    const onInputFocus = useCallback((e) => {
        const val = tryToInteger(e.target.value)
        const key = e.target.getAttribute("id")

        setInitialValues((initialValues) => ({ ...initialValues, [key]: val }))
    }, [])

    const onInputChange = useCallback(
        (e) => {
            let value = tryToInteger(e.target.value)
            const key = e.target.getAttribute("id")

            if (selectedFurniture[key] === value) return

            if (key === "posX" || key === "posY") {
                if (selectedFurniture.position[key] === value) return
            }

            if (units === "imperial") {
                value = tryToFloat(e.target.value)
            }

            if (typeof value === "number") {
                value = convertUnits(value, units, "metric")
            }

            let updatedItem = {
                ...selectedFurniture,
                [key]: value,
            }

            if (key === "posX" || key === "posY") {
                updatedItem = {
                    ...selectedFurniture,
                    position: {
                        ...selectedFurniture.position,
                        [key]: value,
                    },
                }
            }

            const [snappedPosX, snappedPosY] = snapToRoom(
                updatedItem,
                updatedItem.position.posX,
                updatedItem.position.posY
            )

            const snappedItem = {
                ...updatedItem,
                position: {
                    posX: snappedPosX,
                    posY: snappedPosY,
                },
            }

            let initial = { ...snappedItem, [key]: initialValues[key] }

            if (key === "posX" || key === "posY") {
                initial = {
                    ...snappedItem,
                    position: {
                        ...snappedItem.position,
                        [key]: initialValues[key],
                    },
                }
            }

            setAction({
                id: uuidv4(),
                title: `${selectedFurniture.name} ${capitalizeString(
                    key
                )} updated.`,
                message: `${capitalizeString(key)} was changed to ${value}`,
                type: "update",
                initial,
                new: snappedItem,
            })

            setSelectedFurniture(snappedItem)
            updateRoomFurniture(snappedItem)
        },
        [
            units,
            convertUnits,
            selectedFurniture,
            setAction,
            setSelectedFurniture,
            snapToRoom,
            updateRoomFurniture,
            initialValues,
        ]
    )

    return (
        <div>
            <h4>{selectedFurniture.name}</h4>
            <div className='properties-button-box'>
                <button
                    className='button-icon primary furniture-control-btn'
                    onClick={() => rotateFurniture(selectedFurniture)}>
                    <Icon
                        icon='fa6-solid:arrow-rotate-right'
                        color='var(--color-primary)'
                        height='16'
                    />
                    <div className='tooltip'>
                        <small>Rotate</small>
                    </div>
                </button>
                <button
                    className='button-icon primary furniture-control-btn'
                    onClick={() =>
                        setFurnitureZIndex(selectedFurniture, "front")
                    }>
                    <Icon
                        icon='fa6-solid:circle-arrow-up'
                        color='var(--color-primary'
                        height='16'
                    />
                    <div className='tooltip'>
                        <small>To front</small>
                    </div>
                </button>
                <button
                    className='button-icon primary furniture-control-btn'
                    onClick={() =>
                        setFurnitureZIndex(selectedFurniture, "back")
                    }>
                    <Icon
                        icon='fa6-solid:circle-arrow-down'
                        color='var(--color-primary'
                        height='16'
                    />
                    <div className='tooltip'>
                        <small>To back</small>
                    </div>
                </button>
                <button
                    className='button-icon primary furniture-control-btn'
                    onClick={() => duplicateFurniture(selectedFurniture)}>
                    <Icon
                        icon='heroicons-solid:document-duplicate'
                        color='var(--color-primary)'
                        height='16'
                    />
                    <div className='tooltip'>
                        <small>Duplicate</small>
                    </div>
                </button>
                <button
                    className='button-icon danger furniture-control-btn'
                    onClick={() => removeFurniture(selectedFurniture)}>
                    <Icon
                        icon='ic:round-delete-forever'
                        height='16'
                        color='var(--color-danger)'
                    />
                    <div className='tooltip'>
                        <small>Delete</small>
                    </div>
                </button>
            </div>
            <div className='form-control'>
                <label htmlFor='name'>Name</label>
                <input
                    id='name'
                    type='text'
                    value={selectedFurniture.name}
                    onChange={onInputChange}
                    onFocus={onInputFocus}
                />
            </div>
            <div className='form-col'>
                <div className='form-control'>
                    <label htmlFor='width'>Width ({getUnitName()})</label>
                    <input
                        type='number'
                        id='width'
                        value={convertUnits(width, "metric", units)}
                        onChange={(e) => {
                            const newWidth = convertUnits(
                                e.target.value,
                                units,
                                "metric"
                            )
                            setWidth(newWidth)
                            if (newWidth > room.width) {
                                setFormWarning({
                                    message:
                                        "Furniture width is higher than room width!",
                                })
                            } else {
                                setFormWarning(null)
                            }
                        }}
                        onBlur={onInputChange}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                onInputChange(e)
                            }
                        }}
                        onFocus={onInputFocus}
                        min={0}
                        step={units === "imperial" ? "0.01" : "1"}
                    />
                </div>
                <div className='form-control'>
                    <label htmlFor='length'>Length ({getUnitName()})</label>
                    <input
                        type='number'
                        id='length'
                        value={convertUnits(length, "metric", units)}
                        onChange={(e) => {
                            const newLength = convertUnits(
                                e.target.value,
                                units,
                                "metric"
                            )
                            setLength(newLength)
                            if (newLength > room.length) {
                                setFormWarning({
                                    message:
                                        "Furniture length is higher than room length!",
                                })
                            } else {
                                setFormWarning(null)
                            }
                        }}
                        onBlur={onInputChange}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                onInputChange(e)
                            }
                        }}
                        onFocus={onInputFocus}
                        min={0}
                        step={units === "imperial" ? 0.01 : 1}
                    />
                </div>
            </div>
            {formWarning && (
                <div className='input-warning'>
                    <Icon
                        icon='ic:baseline-warning'
                        color='#f47f36'
                        height='24'
                    />
                    <small>{formWarning.message}</small>
                </div>
            )}

            <div className='form-col'>
                <div className='form-control'>
                    <label htmlFor='posX'>Position X ({getUnitName()})</label>
                    {room.width - selectedFurniture.width <= 0 ? (
                        <small>Only one position possible</small>
                    ) : (
                        <div className='range-input-wrap'>
                            <input
                                type='range'
                                id='posX'
                                min={0}
                                max={convertUnits(
                                    room.width - selectedFurniture.width,
                                    "metric",
                                    units
                                )}
                                value={convertUnits(
                                    selectedFurniture.position.posX,
                                    "metric",
                                    units
                                )}
                                onChange={onInputChange}
                                onFocus={onInputFocus}
                                step={units === "imperial" ? 0.01 : 1}
                            />
                            <small>
                                {convertUnits(
                                    selectedFurniture.position.posX,
                                    "metric",
                                    units
                                )}
                            </small>
                        </div>
                    )}
                </div>
                <div className='form-control'>
                    <label htmlFor='posY'>Position Y ({getUnitName()})</label>
                    {room.length - selectedFurniture.length <= 0 ? (
                        <small>Only one position possible</small>
                    ) : (
                        <div className='range-input-wrap'>
                            <input
                                type='range'
                                id='posY'
                                min={0}
                                max={convertUnits(
                                    room.length - selectedFurniture.length,
                                    "metric",
                                    units
                                )}
                                value={convertUnits(
                                    selectedFurniture.position.posY,
                                    "metric",
                                    units
                                )}
                                onChange={onInputChange}
                                onFocus={onInputFocus}
                                step={units === "imperial" ? 0.01 : 1}
                            />
                            <small>
                                {convertUnits(
                                    selectedFurniture.position.posY,
                                    "metric",
                                    units
                                )}
                            </small>
                        </div>
                    )}
                </div>
            </div>
            <div className='form-col'>
                <div className='form-control'>
                    <label htmlFor='color'>Color</label>
                    <input
                        type='color'
                        id='color'
                        value={selectedFurniture.color}
                        onChange={onInputChange}
                        onFocus={onInputFocus}
                    />
                </div>
                <div className='form-control'>
                    <label htmlFor='texture'>Texture</label>
                    <select
                        name='texture'
                        id='texture'
                        value={selectedFurniture.texture}
                        onChange={onInputChange}
                        onFocus={onInputFocus}>
                        {Object.keys(textures).map((texture, i) => (
                            <option key={i} value={texture}>
                                {capitalizeString(texture)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default FurnitureProperties
