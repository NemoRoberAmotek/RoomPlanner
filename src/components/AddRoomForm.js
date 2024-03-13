import { useAuth } from "../contexts/AuthProvider"
import useInput from "../hooks/useInput"
import { capitalizeString, tryToInteger } from "../helpers/strings"
import getTextures from "../helpers/getTextures"
import { useState } from "react"
import PropTypes from "prop-types"

const AddRoomForm = ({ callback = (f) => f }) => {
    const { setUserRooms } = useAuth()
    const [nameProps, resetName] = useInput("")
    const [widthProps, resetWidth] = useInput(0)
    const [lengthProps, resetLength] = useInput(0)
    const [colorProps, resetColor] = useInput("#ffffff")
    const [textureProps, ressetTexture] = useInput("none")
    const { token } = useAuth()

    const [errors, setErrors] = useState([])

    const { textures } = getTextures()

    const onSubmit = (e) => {
        e.preventDefault()
        const room = {
            name: nameProps.value,
            width: tryToInteger(widthProps.value),
            length: tryToInteger(lengthProps.value),
            color: colorProps.value,
            furniture: [],
            texture: textureProps.value,
        }

        postRoomToServer(room)
        resetName()
        resetWidth()
        resetLength()
        resetColor()
        ressetTexture()
        callback()
    }

    const postRoomToServer = async (roomData) => {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/rooms`, {
            method: "POST",
            headers: {
                "x-auth-token": token,
                "Content-type": "Application/json",
            },
            body: JSON.stringify(roomData),
        })

        const data = await res.json()

        if (res.status === 200) {
            setUserRooms((rooms) => [...rooms, data])
        } else {
            if (res.errors) {
                setErrors(res.errors)
            }
        }
    }

    return (
        <div>
            <h2>Add a room.</h2>
            {errors.length > 0 && (
                <div className='form-errors'>
                    {errors.map((error, i) => (
                        <span key={i}>{error.msg}</span>
                    ))}
                </div>
            )}
            <form onSubmit={(e) => onSubmit(e)}>
                <div className='form-control'>
                    <label htmlFor='roomname'>Room name</label>
                    <input
                        type='text'
                        id='roomname'
                        placeholder="Your room's name"
                        {...nameProps}
                    />
                </div>
                <div className='form-col'>
                    <div className='form-control'>
                        <label htmlFor='roomwidth'>Room floor width</label>
                        <input
                            type='number'
                            id='roomwidth'
                            placeholder="Your room's width"
                            {...widthProps}
                        />
                    </div>
                    <div className='form-control'>
                        <label htmlFor='roomlength'>Room floor length</label>
                        <input
                            type='number'
                            id='roomlength'
                            placeholder="Your room's length"
                            {...lengthProps}
                        />
                    </div>
                </div>

                <div className='form-col'>
                    <div className='form-control'>
                        <label htmlFor='roomcolor'>Room floor color</label>
                        <input
                            type='color'
                            id='roomcolor'
                            placeholder="Your room floor's color"
                            {...colorProps}
                        />
                    </div>
                    <div className='form-control'>
                        <label htmlFor='texture'>Texture</label>
                        <select name='texture' id='texture' {...textureProps}>
                            {Object.keys(textures).map((texture, i) => (
                                <option key={i} value={texture}>
                                    {capitalizeString(texture)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type='submit' className='button-primary'>
                    Add room
                </button>
            </form>
        </div>
    )
}

AddRoomForm.propTypes = {
    callback: PropTypes.func,
}

export default AddRoomForm
