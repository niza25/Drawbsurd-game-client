import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { signup } from '../../actions/users'
import SignupForm from './SignupForm'
import { Redirect } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'

class SignupPage extends PureComponent {
	handleSubmit = (data) => {
		this.props.postSignup(data.firstName, data.email, data.password)
	}

	render() {
		if (this.props.signup.success) return (
			<Redirect to="/" />
		)

		return (
			<div>
				<Paper className="outer-paper">
				<h1>Sign up</h1>

				<SignupForm onSubmit={this.handleSubmit} />

				<p style={{ color: 'red' }}>{this.props.signup.error}</p>
				</Paper>
				</div>
		)
	}
}

const mapStateToProps = function (state) {
	return {
		signup: state.signup
	}
}

export default connect(mapStateToProps, { postSignup: signup })(SignupPage)