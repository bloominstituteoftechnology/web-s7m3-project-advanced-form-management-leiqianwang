// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useState, useEffect } from 'react';
import * as yup from "yup";
import axios from 'axios';

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

const formSchema = yup.object().shape({
  username: yup.string().required(e.usernameRequired).min(3, e.usernameMin).max(20, e.usernameMax),
  favLanguage: yup.string().required(e.favLanguageRequired).oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: yup.string().required(e.favFoodRequired).oneOf(['broccoli', 'spaghetti', 'pizza'], e.favFoodOptions),
  agreement: yup.boolean().oneOf([true], e.agreementOptions).required(e.agreementRequired),
});


export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
 // username, favLanguage, favFood, and agreement keys.
  const [values, setValues] = useState({username: '',  favLanguage: '', favFood: '', agreement: false});
  const [errors, setErrors] = useState({}); // Initialize errors as an empty object
  const [enabled, setEnabled] = useState(false); 
  const [success, setSuccess] = useState('');
  const [failure, setFailure] = useState('');
 // const [submitted, setSubmitted] = useState(false); // Track form submission
  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.

  useEffect(() => {
    formSchema.isValid(values).then((isValid) => {
      setEnabled(isValid);
    });
  }, [values]);

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(''); // Clear the success message after 5 seconds
      }, 5000); // 5000ms is 5 seconds
    }

    // Clean up the timer on unmount or if the success message changes
    return () => clearTimeout(timer);
  }, [success]);



  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.

    let { type, checked, name, value } = evt.target;
    if (type === "checkbox") value = checked;
    setValues({ ...values, [name]: value });
    
    // Validate the updated value and set the error message
    formSchema
      .validateAt(name, { [name]: value })
      .then(() => {
        setErrors({ ...errors, [name]: "" });
      })
      .catch((err) => {
        setErrors({ ...errors, [name]: err.message });
      });
  }
  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault();
    setEnabled(false);
    axios
      .post("https://webapis.bloomtechdev.com/registration", values)
      .then((res) => {
        setSuccess(`Welcome! ${values.username}`);
        setFailure("");
       // setSubmitted(true); // Set form as submitted
        setValues({ username: '', favLanguage: '', favFood: '', agreement: false }); // Reset the form
     
      })
      .catch((err) => {
        setFailure(err.response.data);
        setSuccess("");
      })
      .finally(() => {
        setEnabled(true);
      })
  }

  return (
    <div>
      <h2>Create an Account</h2>
      {success && <div style={{ padding: '10px', backgroundColor: 'green', color: 'white',  fontFamily: 'sans-serif'}}>{success}</div>}
      {failure && (
        <div>
          <p>Error Message: {failure.message}</p>
          <p>Error Data: {JSON.stringify(failure.data)}</p>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Type Username"
            value={values.username}
            onChange={onChange}
          />
          {errors.username && <span>{errors.username}</span>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input
                type="radio"
                name="favLanguage"
                value="javascript"
                checked={values.favLanguage === 'javascript'}
                onChange={onChange}
              />
              JavaScript
            </label>
            <label>
              <input
                type="radio"
                name="favLanguage"
                value="rust"
                checked={values.favLanguage === 'rust'}
                onChange={onChange}
              />
              Rust
            </label>
          </fieldset>
          {errors.favLanguage && <span>{errors.favLanguage}</span>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select
            id="favFood"
            name="favFood"
            value={values.favFood}
            onChange={onChange}
          >
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {errors.favFood && <span>{errors.favFood}</span>}
        </div>

        <div className="inputGroup">
          <label>
            <input
              id="agreement"
              type="checkbox"
              name="agreement"
              checked={values.agreement}
              onChange={onChange}
            />
            Agree to our terms
          </label>
          {errors.agreement && <span>{errors.agreement}</span>}
        </div>

        <div>
          <input type="submit" disabled={!enabled} />
        </div>
      </form>
    </div>
  )
}