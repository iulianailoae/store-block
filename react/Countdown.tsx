import React from 'react';
import { TimeSplit } from './typings/global';
import { tick } from './utils/time';
import { useCssHandles } from "vtex.css-handles";
// import { FormattedMessage } from 'react-intl';
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct';
import productReleaseDateQuery from './queries/productReleaseDate.graphql';

interface CountdownProps {
  targetDate: string
}



const CSS_HANDLES = ['countdown']
const DEFAULT_TARGET_DATE = (new Date('2020-06-25')).toISOString();

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ }) => {

  const { product: { linkText } } = useProduct();
  const { data, loading, error } = useQuery(productReleaseDateQuery, {
    variables: {
      slug: linkText
    },
    ssr: false
  });

  const [timeRemaining, setTime] = React.useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  const handles = useCssHandles(CSS_HANDLES)
  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  return (
    <div className={`${handles.countdown} t-heading-2 fw3 w-100 c-muted-1 db tc`}>
      {
        loading ? <div>
          <span>Loading...</span>
        </div> : null
      }
      {
        error ? <div>
          <span>Error!</span>
        </div> : null
      }
      <div className={`${handles.countdown} db tc`}></div>
      <h1>{`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}</h1>
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Final date',
      description: 'Final date used in the countdown',
      type: 'string',
      default: null,
    },
  },
}

export default Countdown