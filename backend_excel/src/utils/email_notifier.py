"""
Sistema de notificação por email para alertar desenvolvedores sobre problemas nos dados Excel.
Envia alertas silenciosos sem impactar a experiência do usuário final.
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import json
import os
from threading import Thread
import traceback

class EmailNotifier:
    def __init__(self):
        self.developer_email = "epav.2025@germinare.org.br"
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.sender_email = os.getenv('SENDER_EMAIL', 'sistema@formulario.local')
        self.sender_password = os.getenv('SENDER_PASSWORD', '')
        self.last_notifications = {}  # Para evitar spam de emails
        self.notification_cooldown = 3600  # 1 hora entre notificações do mesmo tipo
        
    def _should_send_notification(self, notification_type):
        """Verifica se deve enviar notificação baseado no cooldown."""
        now = datetime.now()
        last_sent = self.last_notifications.get(notification_type)
        
        if last_sent is None:
            return True
            
        time_diff = (now - last_sent).total_seconds()
        return time_diff >= self.notification_cooldown
    
    def _send_email_async(self, subject, body, error_details=None):
        """Envia email de forma assíncrona para não bloquear a aplicação."""
        def send_email():
            try:
                # Criar mensagem
                message = MIMEMultipart("alternative")
                message["Subject"] = f"[FORMULÁRIO PEDIDOS] {subject}"
                message["From"] = self.sender_email
                message["To"] = self.developer_email
                
                # Corpo do email em HTML
                html_body = f"""
                <html>
                <body>
                    <h2>Alerta do Sistema de Formulário de Pedidos</h2>
                    <p><strong>Data/Hora:</strong> {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
                    <p><strong>Tipo:</strong> {subject}</p>
                    
                    <h3>Descrição:</h3>
                    <p>{body}</p>
                    
                    {f'<h3>Detalhes Técnicos:</h3><pre>{error_details}</pre>' if error_details else ''}
                    
                    <hr>
                    <p><small>Este é um alerta automático do sistema. Não responda a este email.</small></p>
                </body>
                </html>
                """
                
                # Anexar corpo HTML
                html_part = MIMEText(html_body, "html")
                message.attach(html_part)
                
                # Enviar email (simulado - em produção usar SMTP real)
                print(f"[EMAIL ALERT] Para: {self.developer_email}")
                print(f"[EMAIL ALERT] Assunto: {message['Subject']}")
                print(f"[EMAIL ALERT] Corpo: {body}")
                if error_details:
                    print(f"[EMAIL ALERT] Detalhes: {error_details}")
                
                # Em produção, descomente o código abaixo para envio real:
                """
                context = ssl.create_default_context()
                with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                    server.starttls(context=context)
                    server.login(self.sender_email, self.sender_password)
                    server.sendmail(self.sender_email, self.developer_email, message.as_string())
                """
                
            except Exception as e:
                print(f"Erro ao enviar email de notificação: {str(e)}")
        
        # Executar em thread separada
        Thread(target=send_email, daemon=True).start()
    
    def notify_data_corruption(self, filename, error_details, corrupted_records=None):
        """Notifica sobre dados corrompidos ou sujos em arquivo Excel."""
        notification_type = f"data_corruption_{filename}"
        
        if not self._should_send_notification(notification_type):
            return
        
        subject = f"Dados Corrompidos Detectados - {filename}"
        
        body = f"""
        Foi detectado um problema nos dados do arquivo {filename}.
        
        O sistema continuará funcionando com dados de fallback, mas é recomendado 
        verificar e corrigir o arquivo Excel o mais breve possível.
        
        Arquivo afetado: {filename}
        Registros problemáticos: {len(corrupted_records) if corrupted_records else 'Não especificado'}
        
        Ação recomendada:
        1. Verificar o arquivo Excel manualmente
        2. Corrigir dados inconsistentes ou malformados
        3. Salvar o arquivo novamente
        4. O sistema detectará automaticamente as correções
        """
        
        error_info = f"""
        Erro: {error_details}
        Arquivo: {filename}
        Registros corrompidos: {json.dumps(corrupted_records, indent=2, ensure_ascii=False) if corrupted_records else 'N/A'}
        """
        
        self._send_email_async(subject, body, error_info)
        self.last_notifications[notification_type] = datetime.now()
    
    def notify_file_access_error(self, filename, error_details):
        """Notifica sobre erro de acesso a arquivo Excel."""
        notification_type = f"file_access_{filename}"
        
        if not self._should_send_notification(notification_type):
            return
        
        subject = f"Erro de Acesso ao Arquivo - {filename}"
        
        body = f"""
        Não foi possível acessar o arquivo {filename}.
        
        O sistema está usando dados de fallback para manter o funcionamento,
        mas é necessário verificar o arquivo Excel.
        
        Possíveis causas:
        - Arquivo não encontrado
        - Arquivo corrompido
        - Permissões insuficientes
        - Arquivo em uso por outro programa
        
        Ação recomendada:
        1. Verificar se o arquivo existe no local correto
        2. Verificar permissões de acesso
        3. Fechar o arquivo se estiver aberto em outro programa
        4. Verificar integridade do arquivo
        """
        
        self._send_email_async(subject, body, error_details)
        self.last_notifications[notification_type] = datetime.now()
    
    def notify_validation_errors(self, filename, validation_errors):
        """Notifica sobre erros de validação de dados."""
        notification_type = f"validation_{filename}"
        
        if not self._should_send_notification(notification_type):
            return
        
        subject = f"Erros de Validação - {filename}"
        
        body = f"""
        Foram encontrados erros de validação no arquivo {filename}.
        
        Total de erros: {len(validation_errors)}
        
        O sistema está filtrando automaticamente os dados inválidos,
        mas é recomendado corrigir os problemas no arquivo fonte.
        
        Tipos de erro encontrados:
        {self._format_validation_errors(validation_errors)}
        
        Ação recomendada:
        1. Revisar os dados no arquivo Excel
        2. Corrigir campos obrigatórios em branco
        3. Verificar formato de emails, CPFs, etc.
        4. Remover caracteres especiais desnecessários
        """
        
        error_details = json.dumps(validation_errors, indent=2, ensure_ascii=False)
        self._send_email_async(subject, body, error_details)
        self.last_notifications[notification_type] = datetime.now()
    
    def notify_system_error(self, error_message, stack_trace=None):
        """Notifica sobre erros gerais do sistema."""
        notification_type = "system_error"
        
        if not self._should_send_notification(notification_type):
            return
        
        subject = "Erro Geral do Sistema"
        
        body = f"""
        Ocorreu um erro inesperado no sistema de formulário de pedidos.
        
        Erro: {error_message}
        
        O sistema pode estar funcionando com funcionalidade limitada.
        É recomendado investigar o problema o mais breve possível.
        """
        
        error_details = f"""
        Erro: {error_message}
        Stack Trace: {stack_trace or 'Não disponível'}
        Timestamp: {datetime.now().isoformat()}
        """
        
        self._send_email_async(subject, body, error_details)
        self.last_notifications[notification_type] = datetime.now()
    
    def _format_validation_errors(self, validation_errors):
        """Formata erros de validação para exibição."""
        error_summary = {}
        
        for error in validation_errors:
            error_type = error.get('type', 'Desconhecido')
            if error_type not in error_summary:
                error_summary[error_type] = 0
            error_summary[error_type] += 1
        
        formatted = []
        for error_type, count in error_summary.items():
            formatted.append(f"- {error_type}: {count} ocorrência(s)")
        
        return '\n'.join(formatted)

# Instância global do notificador
email_notifier = EmailNotifier()

