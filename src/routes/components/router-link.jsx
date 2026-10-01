import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'
import { Link } from 'react-router-dom'

const RouterLink = forwardRef(({ href, ...other }, ref) => (
    <Link ref={ref} to={href} {...other} style={{ textDecoration: 'none' }} />
))

RouterLink.propTypes = {
    href: PropTypes.string,
}

export default RouterLink
