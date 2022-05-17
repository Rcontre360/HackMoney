import React from "react";
import TextField, {TextFieldProps} from "@mui/material/TextField";
import {useField, FieldHookConfig} from "formik";

const FormikText: React.FunctionComponent<TextFieldProps> = (props) => {
        const [field, {error}] = useField(props as unknown as FieldHookConfig<any>);
        return (
                <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        error={Boolean(error)}
                        helperText={error}
                        {...props}
                        {...field}
                />
        );
};

export default FormikText
