import React from 'react'
import './styles/LinkCard.scss'

const LinkCard = ({ link }) => {
  return (
    <div className="row link-card">
        <div className="col s12 m6">
            <div className="card grey darken-2">
                <div className="card-content white-text">
                    <span className="card-title">Link</span>
                    <p>Cutted link: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a> </p>
                    <p>From: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a> </p>
                    <p>Counts click: <strong>{link.clicks}</strong> </p>
                    <p>Creation date: <strong>{new Date(link.date).toLocaleDateString()}</strong> </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LinkCard
