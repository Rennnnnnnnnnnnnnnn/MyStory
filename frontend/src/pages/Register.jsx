import { useState } from "react";
import axios from 'axios';

function RegisterAccount() {

    const [info, setInfo] = useState({
        email: "",
        password: ""
    })

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/api/auth/register",
                info
            )
            console.log(res.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        name="email"
                        type="text"
                        value={info.email}
                        onChange={handleOnChange}
                        required
                    />
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        value={info.password}
                        onChange={handleOnChange}
                        required
                    />
                    <button
                        type="submit">
                        Submit
                    </button>
                </form>


            </div>
        </>
    )
}

export default RegisterAccount;