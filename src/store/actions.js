import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/utils'
import store from '.'

export function selectPlay ({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', list)
  commit('setCurrentIndex', index)
}

export function randomPlay ({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlaylist', shuffle(list))
  commit('setCurrentIndex', 0)
}

export function changeMode ({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  const index = state.playlist.findIndex(song => {
    return song.id === currentId
  })

  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export function removeSong ({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playlist = state.playlist.slice()

  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playlist, song)
  if (playIndex < 0 || sequenceIndex < 0) { return }

  let currentIndex = state.currentIndex
  if (playIndex < currentIndex || currentIndex === playlist.length - 1) {
    currentIndex--
  }

  sequenceList.splice(sequenceIndex, 1)
  playlist.splice(playIndex, 1)

  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  if (!playlist.length) { commit('setPlayingState', false) }
}

export function clearSongList ({ commit }) {
  commit('setSequenceList', [])
  commit('setPlaylist', [])
  commit('setCurrentIndex', 0)
  store.commit('setPlayingState', false)
}

function findIndex (list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
