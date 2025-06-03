import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/authSlice';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user)!;
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setForm({ name: user.name, email: user.email, password: '' });
  }, [user]);

  const changed =
    form.name !== user.name || form.email !== user.email || !!form.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const data: any = {};
    if (form.name !== user.name) data.name = form.name;
    if (form.email !== user.email) data.email = form.email;
    if (form.password) data.password = form.password;
    if (Object.keys(data).length) dispatch(updateUser(data));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setForm({ name: user.name, email: user.email, password: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <ProfileUI
      formValue={form}
      isFormChanged={changed}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleChange}
    />
  );
};
