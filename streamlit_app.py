import sqlite3
import streamlit as st

DB_PATH = 'database.db'


def init_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    cur = conn.cursor()
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS ferramentas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT,
            descricao TEXT,
            fabricante TEXT
        )'''
    )
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS estoque (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT,
            descricao TEXT,
            quantidade INTEGER
        )'''
    )
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS requisicoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT,
            descricao TEXT
        )'''
    )
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS fornecedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            contato TEXT
        )'''
    )
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT,
            perfil TEXT,
            setor TEXT
        )'''
    )
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS configuracoes (
            chave TEXT PRIMARY KEY,
            valor TEXT
        )'''
    )
    cur.execute(
        '''CREATE TABLE IF NOT EXISTS movimentacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ferramenta TEXT,
            tipo TEXT,
            quantidade INTEGER,
            usuario TEXT,
            data TEXT,
            status TEXT
        )'''
    )
    conn.commit()
    return conn


conn = init_db()


# ----- helper functions -----

def dashboard_page():
    st.header('Dashboard')
    ferr = conn.execute('SELECT COUNT(*) FROM ferramentas').fetchone()[0]
    est = conn.execute('SELECT COUNT(*) FROM estoque').fetchone()[0]
    req = conn.execute('SELECT COUNT(*) FROM requisicoes').fetchone()[0]
    forn = conn.execute('SELECT COUNT(*) FROM fornecedores').fetchone()[0]
    c1, c2, c3, c4 = st.columns(4)
    c1.metric('Ferramentas', ferr)
    c2.metric('Estoque', est)
    c3.metric('Requisições', req)
    c4.metric('Fornecedores', forn)


def ferramentas_page():
    st.header('Ferramentas')
    tool = st.session_state.get('tool', {'id': None, 'codigo': '', 'descricao': '', 'fabricante': ''})
    with st.form('tool_form', clear_on_submit=False):
        codigo = st.text_input('Código', value=tool['codigo'])
        descricao = st.text_input('Descrição', value=tool['descricao'])
        fabricante = st.text_input('Fabricante', value=tool['fabricante'])
        submitted = st.form_submit_button('Salvar')
        if submitted:
            if tool['id']:
                conn.execute('UPDATE ferramentas SET codigo=?, descricao=?, fabricante=? WHERE id=?',
                             (codigo, descricao, fabricante, tool['id']))
                st.success('Ferramenta atualizada.')
            else:
                conn.execute('INSERT INTO ferramentas (codigo, descricao, fabricante) VALUES (?, ?, ?)',
                             (codigo, descricao, fabricante))
                st.success('Ferramenta adicionada.')
            conn.commit()
            st.session_state.tool = {'id': None, 'codigo': '', 'descricao': '', 'fabricante': ''}
            st.experimental_rerun()

    st.subheader('Lista de Ferramentas')
    rows = conn.execute('SELECT id, codigo, descricao, fabricante FROM ferramentas').fetchall()
    for r in rows:
        col1, col2, col3 = st.columns([5, 1, 1])
        col1.write(f"{r[1]} - {r[2]} ({r[3]})")
        if col2.button('Editar', key=f'tool_edit_{r[0]}'):
            st.session_state.tool = {'id': r[0], 'codigo': r[1], 'descricao': r[2], 'fabricante': r[3]}
            st.experimental_rerun()
        if col3.button('Excluir', key=f'tool_del_{r[0]}'):
            conn.execute('DELETE FROM ferramentas WHERE id=?', (r[0],))
            conn.commit()
            st.experimental_rerun()


def estoque_page():
    st.header('Estoque')
    item = st.session_state.get('stock', {'id': None, 'codigo': '', 'descricao': '', 'quantidade': 0})
    with st.form('stock_form', clear_on_submit=False):
        codigo = st.text_input('Código', value=item['codigo'])
        descricao = st.text_input('Descrição', value=item['descricao'])
        quantidade = st.number_input('Quantidade', min_value=0, step=1, value=item['quantidade'])
        submitted = st.form_submit_button('Salvar')
        if submitted:
            if item['id']:
                conn.execute('UPDATE estoque SET codigo=?, descricao=?, quantidade=? WHERE id=?',
                             (codigo, descricao, int(quantidade), item['id']))
                st.success('Item atualizado.')
            else:
                conn.execute('INSERT INTO estoque (codigo, descricao, quantidade) VALUES (?, ?, ?)',
                             (codigo, descricao, int(quantidade)))
                st.success('Item adicionado.')
            conn.commit()
            st.session_state.stock = {'id': None, 'codigo': '', 'descricao': '', 'quantidade': 0}
            st.experimental_rerun()

    st.subheader('Itens em Estoque')
    rows = conn.execute('SELECT id, codigo, descricao, quantidade FROM estoque').fetchall()
    for r in rows:
        col1, col2, col3 = st.columns([5, 1, 1])
        col1.write(f"{r[1]} - {r[2]} (Qtd: {r[3]})")
        if col2.button('Editar', key=f'stock_edit_{r[0]}'):
            st.session_state.stock = {'id': r[0], 'codigo': r[1], 'descricao': r[2], 'quantidade': r[3]}
            st.experimental_rerun()
        if col3.button('Excluir', key=f'stock_del_{r[0]}'):
            conn.execute('DELETE FROM estoque WHERE id=?', (r[0],))
            conn.commit()
            st.experimental_rerun()


def requisicoes_page():
    st.header('Requisições')
    req = st.session_state.get('req', {'id': None, 'numero': '', 'descricao': ''})
    with st.form('req_form', clear_on_submit=False):
        numero = st.text_input('Número', value=req['numero'])
        descricao = st.text_input('Descrição', value=req['descricao'])
        submitted = st.form_submit_button('Salvar')
        if submitted:
            if req['id']:
                conn.execute('UPDATE requisicoes SET numero=?, descricao=? WHERE id=?',
                             (numero, descricao, req['id']))
                st.success('Requisição atualizada.')
            else:
                conn.execute('INSERT INTO requisicoes (numero, descricao) VALUES (?, ?)', (numero, descricao))
                st.success('Requisição cadastrada.')
            conn.commit()
            st.session_state.req = {'id': None, 'numero': '', 'descricao': ''}
            st.experimental_rerun()

    st.subheader('Lista de Requisições')
    rows = conn.execute('SELECT id, numero, descricao FROM requisicoes').fetchall()
    for r in rows:
        col1, col2, col3 = st.columns([5, 1, 1])
        col1.write(f"{r[1]} - {r[2]}")
        if col2.button('Editar', key=f'req_edit_{r[0]}'):
            st.session_state.req = {'id': r[0], 'numero': r[1], 'descricao': r[2]}
            st.experimental_rerun()
        if col3.button('Excluir', key=f'req_del_{r[0]}'):
            conn.execute('DELETE FROM requisicoes WHERE id=?', (r[0],))
            conn.commit()
            st.experimental_rerun()


def fornecedores_page():
    st.header('Fornecedores')
    forn = st.session_state.get('forn', {'id': None, 'nome': '', 'contato': ''})
    with st.form('forn_form', clear_on_submit=False):
        nome = st.text_input('Nome', value=forn['nome'])
        contato = st.text_input('Contato', value=forn['contato'])
        submitted = st.form_submit_button('Salvar')
        if submitted:
            if forn['id']:
                conn.execute('UPDATE fornecedores SET nome=?, contato=? WHERE id=?', (nome, contato, forn['id']))
                st.success('Fornecedor atualizado.')
            else:
                conn.execute('INSERT INTO fornecedores (nome, contato) VALUES (?, ?)', (nome, contato))
                st.success('Fornecedor cadastrado.')
            conn.commit()
            st.session_state.forn = {'id': None, 'nome': '', 'contato': ''}
            st.experimental_rerun()

    st.subheader('Lista de Fornecedores')
    rows = conn.execute('SELECT id, nome, contato FROM fornecedores').fetchall()
    for r in rows:
        col1, col2, col3 = st.columns([5, 1, 1])
        col1.write(f"{r[1]} - {r[2]}")
        if col2.button('Editar', key=f'forn_edit_{r[0]}'):
            st.session_state.forn = {'id': r[0], 'nome': r[1], 'contato': r[2]}
            st.experimental_rerun()
        if col3.button('Excluir', key=f'forn_del_{r[0]}'):
            conn.execute('DELETE FROM fornecedores WHERE id=?', (r[0],))
            conn.commit()
            st.experimental_rerun()


def usuarios_page():
    st.header('Usuários')
    user = st.session_state.get('user', {'id': None, 'nome': '', 'email': '', 'perfil': '', 'setor': ''})
    with st.form('user_form', clear_on_submit=False):
        nome = st.text_input('Nome', value=user['nome'])
        email = st.text_input('Email', value=user['email'])
        perfil = st.text_input('Perfil', value=user['perfil'])
        setor = st.text_input('Setor', value=user['setor'])
        submitted = st.form_submit_button('Salvar')
        if submitted:
            if user['id']:
                conn.execute('UPDATE usuarios SET nome=?, email=?, perfil=?, setor=? WHERE id=?',
                             (nome, email, perfil, setor, user['id']))
                st.success('Usuário atualizado.')
            else:
                conn.execute('INSERT INTO usuarios (nome, email, perfil, setor) VALUES (?, ?, ?, ?)',
                             (nome, email, perfil, setor))
                st.success('Usuário adicionado.')
            conn.commit()
            st.session_state.user = {'id': None, 'nome': '', 'email': '', 'perfil': '', 'setor': ''}
            st.experimental_rerun()

    st.subheader('Lista de Usuários')
    rows = conn.execute('SELECT id, nome, email, perfil, setor FROM usuarios').fetchall()
    for r in rows:
        col1, col2, col3 = st.columns([5, 1, 1])
        col1.write(f"{r[1]} ({r[2]}) - {r[3]} / {r[4]}")
        if col2.button('Editar', key=f'user_edit_{r[0]}'):
            st.session_state.user = {'id': r[0], 'nome': r[1], 'email': r[2], 'perfil': r[3], 'setor': r[4]}
            st.experimental_rerun()
        if col3.button('Excluir', key=f'user_del_{r[0]}'):
            conn.execute('DELETE FROM usuarios WHERE id=?', (r[0],))
            conn.commit()
            st.experimental_rerun()


def configuracoes_page():
    st.header('Configurações')
    empresa = conn.execute('SELECT valor FROM configuracoes WHERE chave="empresa"').fetchone()
    cnpj = conn.execute('SELECT valor FROM configuracoes WHERE chave="cnpj"').fetchone()
    tel = conn.execute('SELECT valor FROM configuracoes WHERE chave="telefone"').fetchone()
    with st.form('cfg_form'):
        empresa_v = st.text_input('Empresa', value=empresa[0] if empresa else '')
        cnpj_v = st.text_input('CNPJ', value=cnpj[0] if cnpj else '')
        tel_v = st.text_input('Telefone', value=tel[0] if tel else '')
        submitted = st.form_submit_button('Salvar')
        if submitted:
            conn.execute('REPLACE INTO configuracoes (chave, valor) VALUES (?, ?)', ('empresa', empresa_v))
            conn.execute('REPLACE INTO configuracoes (chave, valor) VALUES (?, ?)', ('cnpj', cnpj_v))
            conn.execute('REPLACE INTO configuracoes (chave, valor) VALUES (?, ?)', ('telefone', tel_v))
            conn.commit()
            st.success('Configurações salvas.')


def movimentacoes_page():
    st.header('Movimentações')
    mov = st.session_state.get('mov', {'id': None, 'ferramenta': '', 'tipo': '', 'quantidade': 0, 'usuario': '', 'data': '', 'status': ''})
    with st.form('mov_form', clear_on_submit=False):
        ferramenta = st.text_input('Ferramenta', value=mov['ferramenta'])
        tipo = st.text_input('Tipo', value=mov['tipo'])
        quantidade = st.number_input('Quantidade', min_value=0, step=1, value=mov['quantidade'])
        usuario = st.text_input('Usuário', value=mov['usuario'])
        data = st.text_input('Data', value=mov['data'])
        status = st.text_input('Status', value=mov['status'])
        submitted = st.form_submit_button('Salvar')
        if submitted:
            if mov['id']:
                conn.execute('''UPDATE movimentacoes SET ferramenta=?, tipo=?, quantidade=?, usuario=?, data=?, status=? WHERE id=?''',
                             (ferramenta, tipo, int(quantidade), usuario, data, status, mov['id']))
                st.success('Movimentação atualizada.')
            else:
                conn.execute('''INSERT INTO movimentacoes (ferramenta, tipo, quantidade, usuario, data, status) VALUES (?, ?, ?, ?, ?, ?)''',
                             (ferramenta, tipo, int(quantidade), usuario, data, status))
                st.success('Movimentação adicionada.')
            conn.commit()
            st.session_state.mov = {'id': None, 'ferramenta': '', 'tipo': '', 'quantidade': 0, 'usuario': '', 'data': '', 'status': ''}
            st.experimental_rerun()

    st.subheader('Histórico')
    rows = conn.execute('SELECT id, ferramenta, tipo, quantidade, usuario, data, status FROM movimentacoes').fetchall()
    for r in rows:
        col1, col2, col3 = st.columns([5, 1, 1])
        col1.write(f"{r[1]} - {r[2]} ({r[3]}) por {r[4]} em {r[5]} [{r[6]}]")
        if col2.button('Editar', key=f'mov_edit_{r[0]}'):
            st.session_state.mov = {'id': r[0], 'ferramenta': r[1], 'tipo': r[2], 'quantidade': r[3], 'usuario': r[4], 'data': r[5], 'status': r[6]}
            st.experimental_rerun()
        if col3.button('Excluir', key=f'mov_del_{r[0]}'):
            conn.execute('DELETE FROM movimentacoes WHERE id=?', (r[0],))
            conn.commit()
            st.experimental_rerun()


def relatorios_page():
    st.header('Relatórios')
    table = st.selectbox('Tabela', ['ferramentas', 'estoque', 'requisicoes', 'fornecedores', 'usuarios', 'movimentacoes'])
    if st.button('Baixar CSV'):
        rows = conn.execute(f'SELECT * FROM {table}').fetchall()
        cols = [d[0] for d in conn.execute(f'SELECT * FROM {table}').description]
        import csv
        import io
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(cols)
        writer.writerows(rows)
        st.download_button('Download', buffer.getvalue(), file_name=f'{table}.csv', mime='text/csv')


# ----- main navigation -----
page = st.sidebar.selectbox(
    'Página',
    [
        'Dashboard',
        'Ferramentas',
        'Estoque',
        'Requisições',
        'Fornecedores',
        'Movimentações',
        'Usuários',
        'Configurações',
        'Relatórios'
    ]
)

if page == 'Dashboard':
    dashboard_page()
elif page == 'Ferramentas':
    ferramentas_page()
elif page == 'Estoque':
    estoque_page()
elif page == 'Requisições':
    requisicoes_page()
elif page == 'Fornecedores':
    fornecedores_page()
elif page == 'Movimentações':
    movimentacoes_page()
elif page == 'Usuários':
    usuarios_page()
elif page == 'Configurações':
    configuracoes_page()
elif page == 'Relatórios':
    relatorios_page()
