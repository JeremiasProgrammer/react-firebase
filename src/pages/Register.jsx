import { Formik } from "formik";
import * as Yup from "yup";
import { register } from "../config/firebase";
import { useUserContext } from "../context/UserContext";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";

import { LoadingButton } from "@mui/lab";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Register = () => {
    const { user } = useUserContext();

    // alternativa con hook
    useRedirectActiveUser(user, "/dashboard");

    const onSubmit = async (
        { email, password },
        { setSubmitting, setErrors, resetForm }
    ) => {
        try {
            await register({ email, password });
            console.log("user registered");
            resetForm();
        } catch (error) {
            console.log(error.code);
            console.log(error.message);
            if (error.code === "auth/email-already-in-use") {
                setErrors({ email: "Email already in use" });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Email no válido")
            .required("Email obligatorio"),
        password: Yup.string()
            .trim()
            .min(6, "Mínimo 6 carácteres")
            .required("Password obligatorio"),
    });

    return (
        <Box sx={{ mt: 8, maxWidth: "400px", mx: "auto", textAlign: "center" }}>
            <Avatar sx={{ mx: "auto", bgcolor: "#111" }} />
            <Typography
                variant="h5"
                component="h1"
                sx={{ mt: 1 }}
            >
                Registro
            </Typography>
            <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({
                    handleSubmit,
                    handleChange,
                    values,
                    isSubmitting,
                    errors,
                    touched,
                    handleBlur,
                }) => (
                    <Box
                        onSubmit={handleSubmit}
                        sx={{ mt: 1 }}
                        component="form"
                    >
                        <TextField
                            type="text"
                            placeholder="email@example.com"
                            value={values.email}
                            onChange={handleChange}
                            name="email"
                            onBlur={handleBlur}
                            id="email"
                            label="Ingrese Email"
                            fullWidth
                            sx={{ mb: 3 }}
                            error={errors.email && touched.email}
                            helperText={
                                errors.email && touched.email && errors.email
                            }
                        />

                        <TextField
                            type="password"
                            placeholder="123123"
                            value={values.password}
                            onChange={handleChange}
                            name="password"
                            onBlur={handleBlur}
                            id="password"
                            label="Ingrese Contraseña"
                            fullWidth
                            sx={{ mb: 3 }}
                            error={errors.password && touched.password}
                            helperText={
                                errors.password &&
                                touched.password &&
                                errors.password
                            }
                        />

                        <LoadingButton
                            type="submit"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            variant="contained"
                            fullWidth
                            sx={{ mb: 3 }}
                        >
                            Registrarse
                        </LoadingButton>
                        <Button
                            fullWidth
                            component={Link}
                            to="/"
                        >
                            ¿Ya tienes cuenta? Ingresa
                        </Button>
                    </Box>
                )}
            </Formik>
        </Box>
    );
};

export default Register;
