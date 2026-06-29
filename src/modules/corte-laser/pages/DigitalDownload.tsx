import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import CorteLaserFooter from '../components/CorteLaserFooter';

export default function DigitalDownload() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setError("Token de descarga no válido.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('digital_orders')
          .select('*')
          .eq('download_token', token)
          .single();

        if (fetchError || !data) {
          setError("Enlace de descarga inválido o expirado.");
          setLoading(false);
          return;
        }

        if (data.status !== 'paid') {
          setError("Este pedido aún no ha sido pagado o aprobado.");
          setLoading(false);
          return;
        }

        if (data.download_count >= data.max_downloads) {
          setError("Has excedido el límite de descargas para este archivo.");
          setLoading(false);
          return;
        }

        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error al validar el enlace.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [token]);

  const handleDownload = async () => {
    if (!order) return;
    
    // Simular que el archivo viene del producto (En un sistema completo, el link estaría en el producto asociado a order.product_id)
    // Ya que para esta demo los productos están hardcodeados en el frontend, mostraremos un enlace simulado de Google Drive.
    const driveLink = 'https://drive.google.com/file/d/1RjJgq7lR18a2j5LGKY5iPdhqDAj-75EN/view?usp=sharing'; 

    try {
      // Incrementar contador de descargas
      const { error } = await supabase
        .from('digital_orders')
        .update({ download_count: order.download_count + 1 })
        .eq('id', order.id);

      if (error) {
        console.error("Error al actualizar contador", error);
        alert("Hubo un error interno. Intenta de nuevo.");
        return;
      }
      
      // Actualizamos estado local
      setOrder({ ...order, download_count: order.download_count + 1 });
      
      // Abrimos link
      window.open(driveLink, '_blank');
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200 flex flex-col">
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-gray-900 text-lg shadow-[0_0_15px_rgba(6,182,212,0.6)]">
              CL
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              Corte Láser | Descargas
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-16 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-cyan-500">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p>Validando enlace seguro...</p>
          </div>
        ) : error ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl text-center shadow-lg shadow-red-900/20">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Acceso Denegado</h2>
            <p className="text-gray-400">{error}</p>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-800 border border-gray-700 p-8 rounded-2xl w-full shadow-[0_0_40px_rgba(6,182,212,0.1)] text-center relative overflow-hidden">
            
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

            <CheckCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4 relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            
            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Tu archivo está listo</h2>
            <p className="text-gray-400 text-sm mb-6 relative z-10">
              {order?.internal_notes || "Descarga Digital"}
            </p>

            <div className="bg-gray-900 p-4 rounded-xl mb-6 flex items-center justify-between border border-gray-700 relative z-10">
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Descargas restantes</p>
                <p className="text-lg font-bold text-white">
                  {order.max_downloads - order.download_count} <span className="text-sm font-normal text-gray-400">de {order.max_downloads}</span>
                </p>
              </div>
              {order.max_downloads - order.download_count > 0 ? (
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                  <Download className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={order.download_count >= order.max_downloads}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all uppercase tracking-wider relative z-10 flex items-center justify-center gap-2 ${
                order.download_count >= order.max_downloads
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-gray-900 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]'
              }`}
            >
              <Download className="w-5 h-5" />
              {order.download_count >= order.max_downloads ? 'Límite alcanzado' : 'Descargar Archivo'}
            </button>
          </motion.div>
        )}
      </main>

      <CorteLaserFooter onAdminAccess={() => {}} />
    </div>
  );
}
