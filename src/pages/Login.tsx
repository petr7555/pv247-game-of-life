import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { FC, FormEvent, useState } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import { logIn } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import getErrorMessage from '../utils/getErrorMsg';

const Login: FC = () => {
  usePageTitle('Login');
  const [submitError, setSubmitError] = useState<string>();
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 8,
      }}
    >
      <Paper
        component="form"
        onSubmit={async (e: FormEvent) => {
          e.preventDefault();
          try {
            await logIn();
            navigate('/');
          } catch (err) {
            setSubmitError(getErrorMessage(err));
          }
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          p: 4,
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" textAlign="center">
          Log in
        </Typography>
        <Stack gap={1}>
          <Button type="submit" variant="contained" startIcon={<GoogleIcon />}>
            Sign in with Google
          </Button>
          {submitError && (
            <Typography variant="caption" textAlign="right" sx={{ color: 'error.main' }}>
              {submitError}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
