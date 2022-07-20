import { GetServerSideProps } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "src/services/api";
import styles from '../styles/pages/home.module.scss';

export default function Home({ businessData }) {
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    setBusiness(businessData);
  }, [businessData])

  if (!business) {
    return <p>carregando...</p>
  }

  return (
    <div className={styles.container}>
      {business?.map(item => (
        <Link href={`/business?id=${item.id}`}>
          <a >{item.name}</a>
        </Link>
      ))}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const business = await api.get('/business').then(({ data }) => data);
  return {
    props: {
      businessData: business.data ?? null,
    }
  }
}
