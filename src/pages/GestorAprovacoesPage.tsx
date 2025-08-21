import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { useToast } from '../contexts/ToastContext';

interface PendingUser {
	user_id: number;
	nome_completo: string;
	email: string;
	cargo?: string;
	unidade_departamento?: string;
	matricula: string;
	status: boolean;
	role?: string;
}

const GestorAprovacoesPage: React.FC = () => {
	const { user } = useAuth();
	const { showToast } = useToast();
	const [loading, setLoading] = useState(true);
	const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
	const [approvingId, setApprovingId] = useState<number | null>(null);

	const loadUsers = async () => {
		try {
			setLoading(true);
			const users = await userService.getAllUsers();
			const pendings = users.filter(u => !u.status);
			setPendingUsers(pendings as unknown as PendingUser[]);
		} catch (e) {
			showToast('Erro ao carregar usuários pendentes', 'error', 5000);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void loadUsers();
	}, []);

	const approve = async (id: number) => {
		if (!user?.user_id) return;
		try {
			setApprovingId(id);
			const res = await userService.approveUser(id, user.user_id);
			if ((res as any).status === 'error' || (res as any).success === false) {
				showToast((res as any).message || 'Apenas gestores podem aprovar.', 'error', 5000);
				return;
			}
			showToast('Usuário aprovado com sucesso', 'success', 3000);
			await loadUsers();
		} catch (e) {
			showToast('Erro ao aprovar usuário', 'error', 5000);
		} finally {
			setApprovingId(null);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-caixa-black">Aprovação de Usuários</h1>
					<p className="text-caixa-gray">Apenas gestores podem aprovar novos cadastros.</p>
				</div>
				<Card>
					{loading ? (
						<div className="p-6 text-center text-caixa-gray">Carregando usuários...</div>
					) : pendingUsers.length === 0 ? (
						<div className="p-6 text-center text-caixa-gray">Nenhum usuário pendente.</div>
					) : (
						<div className="divide-y divide-gray-200">
							{pendingUsers.map((u) => (
								<div key={u.user_id} className="flex items-center justify-between p-4">
									<div>
										<p className="font-semibold text-caixa-black">{u.nome_completo} <span className="text-xs text-caixa-gray">({u.matricula})</span></p>
										<p className="text-sm text-caixa-gray">{u.email} {u.cargo ? `• ${u.cargo}` : ''} {u.unidade_departamento ? `• ${u.unidade_departamento}` : ''}</p>
									</div>
									<button
										disabled={approvingId === u.user_id}
										onClick={() => void approve(u.user_id)}
										className={`px-4 py-2 rounded-caixa text-sm font-semibold ${approvingId === u.user_id ? 'bg-gray-200 text-gray-500' : 'bg-caixa-blue text-white hover:bg-caixa-blue-light'}`}
									>
										{approvingId === u.user_id ? 'Aprovando...' : 'Aprovar'}
									</button>
								</div>
							))}
						</div>
					)}
				</Card>
			</main>
		</div>
	);
};

export default GestorAprovacoesPage;
