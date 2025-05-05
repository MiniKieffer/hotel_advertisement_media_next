import Ad_Detail from './ad_detail';

export default async function Page({params}) {
    const { ad_id } = await params;
  return <Ad_Detail ad_id = {ad_id}/>;
}