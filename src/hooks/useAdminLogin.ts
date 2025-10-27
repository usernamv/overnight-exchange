import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(adminEmail, adminPassword);
    if (success) {
      setShowAdminLogin(false);
      setAdminEmail('');
      setAdminPassword('');
      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать в админ-панель!',
      });
      navigate('/admin');
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный email или пароль',
        variant: 'destructive',
      });
    }
  };

  return {
    showAdminLogin,
    adminEmail,
    adminPassword,
    setShowAdminLogin,
    setAdminEmail,
    setAdminPassword,
    handleAdminLogin,
  };
};
