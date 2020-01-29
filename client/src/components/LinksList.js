import React from 'react'
import { Link } from 'react-router-dom'

const LinksList = ({ links }) => {

    if (!links.length) {
        return <p>You don't have links yet!</p>
    }

    return (
    <table>
        <thead>
            <tr>
                <th>№</th>
                <th>Original</th>
                <th>Cutted</th>
                <th>Open</th>
            </tr>
        </thead>

        <tbody>
            { links.map((link, index) => {
                return (
                    <tr key={link._id}>
                        <td>{++index}</td>
                        <td>{link.from}</td>
                        <td>{link.to}</td>
                        <td>
                            <Link to={`/detail/${link._id}`}>Open</Link>
                        </td>
                    </tr>
                )
            }) }
        </tbody>
    </table>
  )
}

export default LinksList
