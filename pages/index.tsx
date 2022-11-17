import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import NavBar from '../components/NavBar/Navbar'
export default function Home() {
  return (
    <div className="h-screen w-full">
      <NavBar/>
    </div>
  )
}
