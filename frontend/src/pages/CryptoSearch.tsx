import { useQuery, useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { GET_ALL_CRYPTOS, GET_CRYPTO_BY_ID } from "../graphql/cryptoQueries";
import "../styles/Table.css";

import _ from "lodash";
import { formatMarketCap } from "../utils/formatNumber";

export default function CryptoSearch() {
  const { loading, error, data, refetch } = useQuery(GET_ALL_CRYPTOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const [searchCrypto, { data: cryptoData, loading: cryptoLoading }] = useLazyQuery(GET_CRYPTO_BY_ID);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      refetch();
      setSearchActive(false);
      return;
    }
  
    setSearchActive(true);
    searchCrypto({ variables: { coinId: searchTerm.trim().toLowerCase() } });
  };

  // Se o usuário apagar o campo, volta à lista completa
  useEffect(() => {
    if (searchTerm.trim() === "" && searchActive) {
      refetch();
      setSearchActive(false);
    }
  }, [searchTerm, searchActive, refetch]);

  // Determina quais dados exibir
  const cryptos = searchActive
    ? cryptoData?.cryptoByCoinId
      ? [cryptoData.cryptoByCoinId]
      : []
    : data?.cryptoPrices || [];

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar criptos: {error.message}</p>;

  return (
    <div className="table-container">
      <h1>Pesquisar Criptomoedas</h1>

      {/* Barra de busca */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar cripto por ID (ex: BTC, ETH, DOGE)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {cryptoLoading ? (
        <p>Buscando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Moeda</th>
              <th>Preço Atual</th>
              <th>Market Cap</th>
              <th>Variação 24h (%)</th>
              <th>Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            {cryptos.length > 0 ? (
              cryptos.map((crypto: any) => (
                <tr key={crypto.id}>
                  <td>{crypto.id.slice(-12)}</td>
                  <td>{_.startCase(crypto.coinId) }</td>
                  <td>U$ {crypto.currentPrice.toFixed(2)}</td>
                  <td>{crypto.marketCap ? formatMarketCap(crypto.marketCap) : "N/A"}</td>
                  <td style={{ color: crypto.change24h >= 0 ? "lightgreen" : "red" }}>
                    {crypto.change24h?.toFixed(2) || "N/A"}%
                  </td>
                  <td>{new Date(Number(crypto.updatedAt)).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>Nenhuma criptomoeda encontrada</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
