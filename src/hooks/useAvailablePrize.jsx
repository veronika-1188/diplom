import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useAvailablePrize() {
  const { user } = useAuth();
  const [prize, setPrize] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrize() {
      try {
        const {  data } = await supabase.from('user_prizes').select('id, prize').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();
        if (data) setPrize({ id: data.id, text: data.prize, source: 'db' });
      } catch (err) {
        console.error('Ошибка загрузки приза:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrize();
  }, [user?.id]);

  const consumePrize = async () => {
    if (!prize) return false;
    if (prize.source === 'db' && prize.id) {
      const { error } = await supabase
        .from('user_prizes')
        .delete()
        .eq('id', prize.id);
      if (!error) {
        setPrize(null);
        return true;
      }
    }
    return false;
  };

  return { prize, loading, consumePrize };
}