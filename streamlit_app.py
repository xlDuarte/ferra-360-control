import sqlite3
import streamlit as st

DB_PATH = 'database.db'

# Initialize database and tables
conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()
cur.execute('''CREATE TABLE IF NOT EXISTS ferramentas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT,
    descricao TEXT,
    fabricante TEXT
)''')
cur.execute('''CREATE TABLE IF NOT EXISTS estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT,
    descricao TEXT,
    quantidade INTEGER
)''')
cur.execute('''CREATE TABLE IF NOT EXISTS requisicoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero TEXT,
    descricao TEXT
)''')
cur.execute('''CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    contato TEXT
)''')
conn.commit()

# Sidebar navigation
page = st.sidebar.selectbox(
    'Página',
    ['Ferramentas', 'Estoque', 'Requisições', 'Relatórios', 'Fornecedores']
)

# Ferramentas page
if page == 'Ferramentas':
    st.header('Ferramentas')
    with st.form('add_tool'):
        codigo = st.text_input('Código')
        descricao = st.text_input('Descrição')
        fabricante = st.text_input('Fabricante')
        submitted = st.form_submit_button('Adicionar')
        if submitted:
            cur.execute(
                'INSERT INTO ferramentas (codigo, descricao, fabricante) VALUES (?, ?, ?)',
                (codigo, descricao, fabricante)
            )
            conn.commit()
            st.success('Ferramenta adicionada.')
    st.subheader('Lista de Ferramentas')
    rows = cur.execute('SELECT id, codigo, descricao, fabricante FROM ferramentas').fetchall()
    for r in rows:
        st.write(f"{r[1]} - {r[2]} ({r[3]})")

# Estoque page
elif page == 'Estoque':
    st.header('Estoque')
    with st.form('add_stock'):
        codigo = st.text_input('Código')
        descricao = st.text_input('Descrição')
        quantidade = st.number_input('Quantidade', min_value=0, step=1)
        submitted = st.form_submit_button('Adicionar')
        if submitted:
            cur.execute(
                'INSERT INTO estoque (codigo, descricao, quantidade) VALUES (?, ?, ?)',
                (codigo, descricao, int(quantidade))
            )
            conn.commit()
            st.success('Item adicionado ao estoque.')
    st.subheader('Itens em Estoque')
    rows = cur.execute('SELECT id, codigo, descricao, quantidade FROM estoque').fetchall()
    for r in rows:
        st.write(f"{r[1]} - {r[2]} (Qtd: {r[3]})")

# Requisicoes page
elif page == 'Requisições':
    st.header('Requisições')
    with st.form('add_req'):
        numero = st.text_input('Número')
        descricao = st.text_input('Descrição')
        submitted = st.form_submit_button('Adicionar')
        if submitted:
            cur.execute(
                'INSERT INTO requisicoes (numero, descricao) VALUES (?, ?)',
                (numero, descricao)
            )
            conn.commit()
            st.success('Requisição cadastrada.')
    st.subheader('Lista de Requisições')
    rows = cur.execute('SELECT id, numero, descricao FROM requisicoes').fetchall()
    for r in rows:
        st.write(f"{r[1]} - {r[2]}")

# Relatórios page
elif page == 'Relatórios':
    st.header('Relatórios')
    ferr_count = cur.execute('SELECT COUNT(*) FROM ferramentas').fetchone()[0]
    estoque_count = cur.execute('SELECT COUNT(*) FROM estoque').fetchone()[0]
    req_count = cur.execute('SELECT COUNT(*) FROM requisicoes').fetchone()[0]
    forn_count = cur.execute('SELECT COUNT(*) FROM fornecedores').fetchone()[0]
    st.write(f"Ferramentas: {ferr_count}")
    st.write(f"Estoque: {estoque_count}")
    st.write(f"Requisições: {req_count}")
    st.write(f"Fornecedores: {forn_count}")

# Fornecedores page
elif page == 'Fornecedores':
    st.header('Fornecedores')
    with st.form('add_forn'):
        nome = st.text_input('Nome')
        contato = st.text_input('Contato')
        submitted = st.form_submit_button('Adicionar')
        if submitted:
            cur.execute(
                'INSERT INTO fornecedores (nome, contato) VALUES (?, ?)',
                (nome, contato)
            )
            conn.commit()
            st.success('Fornecedor cadastrado.')
    st.subheader('Lista de Fornecedores')
    rows = cur.execute('SELECT id, nome, contato FROM fornecedores').fetchall()
    for r in rows:
        st.write(f"{r[1]} - {r[2]}")

